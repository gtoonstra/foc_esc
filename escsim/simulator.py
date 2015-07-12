import math
import constants

class Simulator(object):

    def __init__ (self):
        self.bemfa = 0.0
        self.bemfb = 0.0
        self.va = 0.0
        self.vb = 0.0
        self.kp = constants.KP_EST_RPM
        self.ki = constants.KI_EST_RPM
        self.ls = 0.035
        self.rs = 1.05
        self.esta = 0.0
        self.estb = 0.0
        self.vq = 0.0
        self.vd = 0.0
        self.v_factor = 0.0

        self.inta = 0.0
        self.intb = 0.0

        self.secretR = 1.05
        self.secretL = 0.035

        self.T = ( 1.0 / constants.FREQ )
        self.F = ( 1.0 - ( self.T * ( self.rs / self.ls )) )
        self.G = ( self.T / self.ls )

        self.K1 = (500*500)
        self.K2 = (2*0.84)/500

        self.factorFfw = constants.AMAX / constants.RPM_MAX

        self.costheta = 0.0
        self.sintheta = 0.0
        self.thetak = 0.0
        self.theta = 0.0

        self.wk = 0.0
        self.a2k = 0.0
        self.rpm = 0.0
        self.real_rpm = 0.0
        self.pwm_in = 1099

        self.rpm_command_lim = 0.0
        self.rpm_i_out = 0.0
        self.rpm_error = 0.0

        self.Iqr = 0.0
        self.Idr = 0.0
        self.Iqm = 0.0
        self.Idm = 0.0
        self.vdc_int = 0.0

    def step_sim( self, t, n ):

        # self.vq = 50
        torque = 0.00537 * self.Iqm
        Pleft = constants.V * self.Iqm * 0.85
        if ( torque > 0 ):
            self.real_rpm = self.real_rpm * 0.99 + 0.01 * (Pleft / torque)
        else:
            self.real_rpm = self.real_rpm * 0.80

        # update real model first.
        self.thetak = (self.real_rpm * t) % (math.pi * 2.0)
        realbemfa = constants.BEMFK * self.real_rpm * math.sin( self.thetak )
        realbemfb = constants.BEMFK * self.real_rpm * math.sin( self.thetak - 2.0943951 )

        self.vdc_int = constants.V * 1000

        # va = 2/3 * valpha
        # vb = -1/3 * valpha + 1/sqrt(3) * vbeta
        # vc = -1/3 * valpha - 1/sqrt(3) * vbeta
        # These are representations of voltages when voltage is applied on coils on the real motor,
        # which need to be calculated separately or the motor won't start turning, since the
        # follower needs something to follow.
        realva = (self.vd * math.cos(self.thetak) - self.vq*math.sin(self.thetak)) * self.v_factor
        realvb = (self.vd * math.sin(self.thetak) + self.vq*math.cos(self.thetak)) * self.v_factor

        va_int = (0.66666 * realva) 
        vb_int = (-0.33333 * realva + constants.ONEDIVSQRT3 * realvb) 
        vc_int = (-0.33333 * realva - constants.ONEDIVSQRT3 * realvb)  

        ia_raw = (va_int / self.secretR)
        # V * 120 degrees
        ib_raw = (vb_int / self.secretR)
        ic_raw = -ia_raw - ib_raw

        # Done with reading sensors. Let's update the follower model.
        if n % constants.LOOP_INTERVAL == 0:
            self.calc_input( t )
            self.calc_output( t )

        # Ialpha = 1.5 * ia_int;                                  // [+-18] [mA]
        # Ibeta = SQRT3DIV2 * (ib_int - ic_int);                  // [+-18] [mA]

        # Do all transformations
        self.Ialpha = ia_raw

        self.Ibeta = constants.SQRT3DIV2 * ( ib_raw - ic_raw )
        # self.Ibeta = constants.ONEDIVSQRT3 * ia_raw + constants.TWODIVSQRT3 * ib_raw
        # self.Ibeta = self.Ibeta

        #Idm = Ialpha*cos(theta) + Ibeta * sin(theta)
        #Iqm = -Ialpha*sin(theta) + Ibeta * cos(theta)

        # GT: CONST_FACTOR removed?
        self.Idm = self.Ialpha * math.cos(self.theta) + self.Ibeta * math.sin(self.theta) 
        #Idm = AIDQP * Idm + AIDQN * temp; // filter

        self.Iqm = -self.Ialpha * math.sin( self.theta ) + self.Ibeta * math.cos(self.theta)
        #Iqm = AIDQP * Iqm + AIDQN * temp; // filter

        # Valpha = vd*cos(theta) - vq*sin(theta)
        # Vbeta = vd*sin(theta) + vq*cos(theta)
        self.va = (self.vd * math.cos(self.theta) - self.vq*math.sin(self.theta))  * self.v_factor
        self.vb = (self.vd * math.sin(self.theta) + self.vq*math.cos(self.theta)) * self.v_factor

        # then update observers...
        self.esta = (self.F * self.esta) + (self.G * (self.va - self.bemfa) )
        self.estb = (self.F * self.estb) + (self.G * (self.vb - self.bemfb) )

        erra = self.Ialpha - self.esta
        errb = self.Ibeta - self.estb

        self.inta = self.inta + (self.ki*erra)
        self.intb = self.intb + (self.ki*errb)
        if self.inta > constants.LIMIT:
            self.inta = constants.LIMIT
        if self.intb > constants.LIMIT:
            self.intb = constants.LIMIT
        if self.inta < -constants.LIMIT:
            self.inta = -constants.LIMIT
        if self.intb < -constants.LIMIT:
            self.intb = -constants.LIMIT

        self.bemfa = -(erra * self.kp) - self.inta
        self.bemfb = -(errb * self.kp) - self.intb

        # i s (n + 1) = F*is(n) + G*(v s (n) - e s (n))  
        # F = 0.9375
        # G = 0.025

        # update the angle tracking observer...
        ek = ( (self.bemfa * constants.BEMFK * self.costheta) + (self.bemfb * constants.BEMFK * self.sintheta) )

        # One measurement per 20 us
        self.wk = self.wk + (self.K1 * self.T * ek )
        self.a2k = self.a2k + ( self.T * self.wk )
        self.rpm = 0.5 * self.rpm + 0.5 * self.wk
        self.theta = ((self.K2 * self.wk) + self.a2k) % (math.pi * 2.0)
        
        self.rpm = self.real_rpm
        self.theta = self.thetak

        self.costheta = math.cos( self.theta )
        self.sintheta = math.sin( self.theta )
    
        print self.Iqm, self.real_rpm, self.rpm

        # return 0, ia_raw * 25 , 0, ib_raw * 25 , 0, va_int , 0, self.Iqm * 25
        # return 0, self.Ialpha * 50, 0, self.Iqm * 50, 0, self.theta, 0, self.va
        # return 5 * self.esta, 5 * self.ia, 5 * self.estb, 5 * self.ib
        return self.Ialpha * 25, self.esta * 25, 0, self.rpm - self.real_rpm, self.thetak * 3, self.theta * 3, realbemfa * 25, self.bemfa * 25
        # return self.Ialpha * 50, self.Ibeta * 50, self.Idm * 50, self.Iqm * 50, self.va, self.vb, erra, errb

    def getPwm( self ):
        return self.pwm_in

    def movepwm( self, inc ):
        self.pwm_in = self.pwm_in + inc

    def calc_input( self, t ):
        temp = (self.pwm_in - constants.PWM_IN_MIN);
        temp *= (constants.RPM_MAX - constants.RPM_MIN);
        temp /= (float)(constants.PWM_IN_MAX - constants.PWM_IN_MIN);
        temp += constants.RPM_MIN;
        
        rpm_command_raw = temp;
        if rpm_command_raw < constants.RPM_MIN:
            rpm_command_raw = 0.0
        if rpm_command_raw > constants.RPM_MAX:
            rpm_command_raw = constants.RPM_MAX
        
        if ( rpm_command_raw >= (self.rpm_command_lim + constants.RPM_SLEW * constants.DT_LOOP) ):
            self.rpm_command_lim += constants.RPM_SLEW * constants.DT_LOOP
        elif ( rpm_command_raw < (self.rpm_command_lim - constants.RPM_SLEW * constants.DT_LOOP) ):
            self.rpm_command_lim -= constants.RPM_SLEW * constants.DT_LOOP
        else:
            self.rpm_command_lim = rpm_command_raw

        if self.rpm_command_lim < 0.0:
            self.rpm_command_lim = 0.0
        if ( self.rpm_command_lim > constants.RPM_MAX ):
            self.rpm_command_lim = constants.RPM_MAX

        # RPM Control Outer Loop
        self.rpm_error = (self.rpm_command_lim - self.rpm)
        rpm_p_out = constants.KP_RPM_UP * self.rpm_error

        if ( (self.rpm_error > 0.0) and (self.rpm_i_out < constants.I_SAT_RPM) ):
            self.rpm_i_out += constants.KI_RPM * self.rpm_error * constants.DT_LOOP
 
        if ( (self.rpm_error < 0.0) and (self.rpm_i_out > -constants.I_SAT_RPM) ):
            self.rpm_i_out += constants.KI_RPM * self.rpm_error * constants.DT_LOOP

        rpm_ff_out = constants.KFF_I * self.rpm_command_lim * self.rpm_command_lim;

        # Feed forward rpm setting
        self.Iqr = rpm_p_out + self.rpm_i_out + rpm_ff_out;
        if ( self.Iqr > constants.AMAX):
            self.Iqr = constants.AMAX
        if ( self.Iqr < -constants.BMAX):
            self.Iqr = -constants.BMAX

        self.Idr = 0.0

        # Request 2A constant
        self.Iqr = 2.0

    def calc_output( self, t ):
        self.vq = self.vq + constants.KPQ * (self.Iqr-self.Iqm);
        self.vq += constants.KFF_V * self.rpm_error;

        # Restrict to 0-75 to maintain 4% minimum off-time.
        # 982
        #if ( self.vq > 40 ):
        #    self.vq = 40
        #if ( self.vq < 0 ):
        #    self.vq = 0

        self.v_factor = 0.264

        if (self.vq > 0):
            self.vd = self.vd + constants.KPD * (self.Idr - self.Idm)
            #if ( self.vd > constants.CHAR_90_DEG):
            #    self.vd = constants.CHAR_90_DEG
            #if ( self.vd < 0):
            #    self.vd = 0
        else:
            vd = 0

