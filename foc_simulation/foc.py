import math
import simconstants

SQRT3DIV2 = 0.866025404
ONEDIVSQRT3 = 1.0/math.sqrt(3.0)
TWODIVSQRT3 = 2.0/math.sqrt(3.0)

class FocController(object):
    def __init__( self ):
        self.omega = 0.0
        self.theta = 0.0
        self.ia = 0.0
        self.ib = 0.0
        self.Ialpha = 0.0
        self.Ibeta = 0.0
        self.bemfa = 0.0
        self.bemfb = 0.0
        self.bemfalpha = 0.0
        self.bemfbeta = 0.0
        self.V = 0.0
        self.sintheta = 0.0
        self.costheta = 0.0
        self.wk = 0.0
        self.a2k = 0.0
        self.rpm = 0.0
        self.theta = 0.0
        self.thetak = 0.0
        self.vd = 0.0
        self.vq = 0.0
        self.intq = 0.0
        self.valpha = 0.0
        self.vbeta = 0.0
        self.esta = 0.0
        self.estb = 0.0
        self.inta = 0.0
        self.intb = 0.0

        self.kp = 0.25

        self.rpm_command_lim = 0.0
        self.rpm_error = 0.0
        self.rpm_i_out = 0.0

        self.Ls = 0.00036
        self.Rs = 0.52
        self.DEG60 = math.pi / 3
        self.DEG120 = 2.0 * self.DEG60
        self.DEG180 = 3.0 * self.DEG60
        self.DEG240 = 4.0 * self.DEG60
        self.DEG300 = 5.0 * self.DEG60
        self.DEG360 = 6.0 * self.DEG60
        self.KP_I = 50
        self.KP_RPM_UP = 0.08       # mA/rpm
        self.KI_RPM = 0.001      # mA/rpm/s
        self.KD_RPM = 0.001
        self.I_SAT_RPM = 20.0    # mA
        self.AMAX = 20.0    # max accelerating current [A]
        self.BMAX = 5.0     # max braking current [A]
        self.KPI = 0.01

        self.T = ( float(simconstants.CONTROLLER_INTERVAL) / simconstants.SIMFREQ )
        self.F = ( 1.0 - ( self.T * ( self.Rs / self.Ls )) )
        self.G = ( self.T / self.Ls )

        self.K1 = (500*500)
        self.K2 = (2*0.84)/500
        
        self.Iqr = 0.0
        self.Iqm = 0.0
        self.Idm = 0.0

    def step_sim( self, dt, elapsed, epoch, throttle, variables ):
        self.omega = variables["omega"]
        self.thetak = variables["theta"]
        self.V = variables["V"]
        self.ib = variables["ib"]
        self.ic = variables["ic"]

        self.ia = -self.ib - self.ic

        if epoch % simconstants.SLOW_INTERVAL == 0:
            self.update_pids( dt, elapsed, epoch, throttle, variables )

        # Ialpha = ia
        # Ibeta = 1.0/V3 * ia + 2.0/V3 * ib
        self.Ialpha = self.ia
        self.Ibeta = ONEDIVSQRT3 * self.ia + TWODIVSQRT3 * self.ib

        #Idm = Ialpha*cos(theta) + Ibeta * sin(theta)
        #Iqm = -Ialpha*sin(theta) + Ibeta * cos(theta)
        self.Idm = self.Ialpha * math.cos(self.theta) + self.Ibeta * math.sin(self.theta)
        self.Iqm = -self.Ialpha * math.sin(self.theta) + self.Ibeta * math.cos(self.theta)

        # Valpha = vd*cos(theta) - vq*sin(theta)
        # Vbeta = vd*sin(theta) + vq*cos(theta)
        #self.valpha = ( self.vd * math.cos(self.theta) - self.vq*math.sin(self.theta) )
        #self.vbeta = ( self.vd * math.sin(self.theta) + self.vq*math.cos(self.theta) )

        # then update observers...
        self.esta = (self.F * self.esta) + (self.G * (self.valpha - self.bemfa) )
        self.estb = (self.F * self.estb) + (self.G * (self.vbeta - self.bemfbeta) )

        erra = self.Ialpha - self.esta
        errb = self.Ibeta - self.estb

        self.bemfa = self.bemfa - (erra * self.kp)
        self.bemfbeta = self.bemfbeta -(errb * self.kp)

        # update the angle tracking observer...
        ek = ( -(self.bemfa * self.costheta) - (self.bemfbeta * self.sintheta) )

        # One measurement per 20 us
        self.wk = self.wk + (self.K1 * self.T * ek )
        self.a2k = self.a2k + ( self.T * self.wk )
        self.rpm = 0.5 * self.rpm + 0.5 * self.wk
        self.theta = ((self.K2 * self.wk) + self.a2k) % (math.pi * 2.0)

        self.costheta = math.cos( self.theta )
        self.sintheta = math.sin( self.theta )

        # Valpha = vd*cos(theta) - vq*sin(theta)
        # Vbeta = vd*sin(theta) + vq*cos(theta)
        self.valpha = ( self.vd * math.cos(self.theta) * 0.001 - self.vq*math.sin(self.theta) * 0.001 ) * simconstants.BUSVOLTAGE
        self.vbeta = ( self.vd * math.sin(self.theta) * 0.001 + self.vq*math.cos(self.theta) * 0.001 ) * simconstants.BUSVOLTAGE

        # Va = Valpha
        # Vb = -1/2 * Valpha + V3/2 * Vbeta
        # Vc = -1/2 * Valpha - V3/2 * Vbeta
        va = self.valpha
        vb = -0.5 * self.valpha + 0.5 * math.sqrt(3) * self.vbeta
        vc = -0.5 * self.valpha - 0.5 * math.sqrt(3) * self.vbeta

        return va, vb, vc
        # return self.step_sim2( dt, elapsed, epoch, throttle, variables )

    def step_sim2( self, dt, elapsed, epoch, throttle, variables ):
        omega = variables["omega"]
        theta = variables["theta"]
        I = variables["I"]
        V = variables["V"]
        bemf = variables["bemfa"]

        va = 0.0
        vb = 0.0
        vc = 0.0

        if theta < self.DEG60:
            # first segment
            va = V * throttle / 100.0
            vb = -V * throttle / 100.0
            vc = 0.0
        elif theta < self.DEG120:
            # second segment
            va = V * throttle / 100.0
            vb = 0.0
            vc = -V * throttle / 100.0
        elif theta < self.DEG180:
            # second segment
            va = 0.0
            vb = V * throttle / 100.0
            vc = -V * throttle / 100.0
        elif theta < self.DEG240:
            # second segment
            va = -V * throttle / 100.0
            vb = V * throttle / 100.0
            vc = 0.0
        elif theta < self.DEG300:
            # second segment
            va = -V * throttle / 100.0
            vb = 0.0
            vc = V * throttle / 100.0
        elif theta < self.DEG360:
            # second segment
            va = 0.0
            vb = -V * throttle / 100.0
            vc = V * throttle / 100.0

        self.valpha = va
        self.vbeta = ONEDIVSQRT3 * va + TWODIVSQRT3 * vb

        return va, vb, vc

    def get_variables( self ):
        # return self.omega, self.theta, self.I, self.ia, self.bemfa, self.Te
        return [ self.rpm, self.theta, self.valpha, self.esta, self.bemfa, 0.0 ]

    def get_errors( self ):
        return [ self.rpm - self.omega, ( self.theta - self.thetak ) * 180.0 / math.pi ]

    def update_pids( self, dt, elapsed, epoch, throttle, variables ):
        rpm_command_raw = simconstants.RPM_MIN + throttle * 0.01 * (simconstants.RPM_MAX - simconstants.RPM_MIN);
        if rpm_command_raw < simconstants.RPM_MIN:
            rpm_command_raw = 0.0
        if rpm_command_raw > simconstants.RPM_MAX:
            rpm_command_raw = simconstants.RPM_MAX
        
        prev_e = self.rpm_error
        # RPM Control Outer Loop
        self.rpm_error = ( rpm_command_raw + self.rpm )
        rpm_i = self.rpm_i_out + self.rpm_error

        rpm_p_out = self.KP_RPM_UP * self.rpm_error

        # Feed forward rpm setting
        self.Iqr = rpm_p_out + rpm_i * self.KI_RPM - self.KD_RPM * ( prev_e - self.rpm_error )
        # self.Iqr = rpm_ff_out + rpm_p_out #+ self.rpm_i_out # + rpm_ff_out # + self.rpm_i_out + rpm_ff_out;
        # self.Iqr = ( throttle / 100.0 ) * self.AMAX
        if ( self.Iqr > self.AMAX):
            self.Iqr = self.AMAX
            self.rpm_i_out = 0
        elif ( self.Iqr < -self.BMAX):
            self.Iqr = -self.BMAX
            self.rpm_i_out = 0
        else:
            self.rpm_i_out = rpm_i

        self.Idr = 0.0
        
        self.vq = self.vq + self.KP_I * (self.Iqr - self.Iqm)
        self.vd = self.vd + self.KP_I * (self.Idr - self.Idm)

        if self.vq > 1000.0:
            self.vq = 1000.0
        if self.vd > 1000.0:
            self.vd = 1000.0

        if self.vq < 0:
            self.vq = 0
        if self.vd < 0:
            self.vd = 0

        print rpm_command_raw, self.omega, self.Iqr, self.Iqm, self.rpm_error, self.vq

def make_controller():
    return FocController()

