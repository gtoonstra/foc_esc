#include <stdio.h>
#include <math.h>
#include "stm32f4xx.h"

#include "algorithms.h"
#include "vars.h"

#define ADC_CURRENT 	0.02
#define ADC_VOLTAGE		0.013
#define ONE_SQRT3		0.577350269
#define TWO_SQRT3		1.154700538
#define K1				500
#define K2				0.00336
#define TWO_PI			6.28318530
#define CHAR_120_DEG    85
#define CHAR_90_DEG     64
#define KP				0.25
#define FREQ			14000
#define SQRT3DIV2		0.866025404

float Ialpha = 0.0;
float Ibeta = 0.0;
float valpha = 0.0;
float vbeta = 0.0;
float vbus = 0.0;
int   drivestate = DS_IDLE;
float theta = 0.0;
float thetak = 0.0;
float Iqm = 0.0;
float Idm = 0.0;
float vq = 0.0;
float vd = 0.0;

uint32_t ledctr = 0;
float ia_raw;
float ib_raw;
int ia_zero = 0;
int ib_zero = 0;
short zero_set = 0;
uint32_t curra_sum = 0;
uint32_t currb_sum = 0;
int curr_samples = 0;
float aHat = 0.0;
float bHat = 0.0;
float erra = 0.0;
float errb = 0.0;
float bemfa = 0.0;
float bemfb = 0.0;
float ek = 0.0;
float wk = 0.0;
float a2k = 0.0;
float sintheta = 0.0;
float costheta = 0.0;
int rpm_measured = 0;
int rpm_desired = 0;
unsigned char v_idx = 0;
unsigned char v_idxk = 0;
float F = 0.0;
float G = 0.0;
float T = 0.0;
float T2 = 0.0;
float TACT = 0.0;
float SCALE_TO_255 = 0.0;
float ls = 0.0;
float rs = 0.0;
int FREQ_KHZ = 0;
unsigned short medium_counter = 0;
int va_int = 0;
int vb_int = 0;
int vc_int = 0;

static float vsin, vcos;
static int vb;

const float SINFLUT[256] =
{
  0.000,  0.025,  0.049,  0.074,  0.098,  0.122,  0.147,  0.171,  0.195,  0.219,  0.243,  0.267,  0.290,  0.314,  0.337,  0.360,
  0.383,  0.405,  0.428,  0.450,  0.471,  0.493,  0.514,  0.535,  0.556,  0.576,  0.596,  0.615,  0.634,  0.653,  0.672,  0.690,
  0.707,  0.724,  0.741,  0.757,  0.773,  0.788,  0.803,  0.818,  0.831,  0.845,  0.858,  0.870,  0.882,  0.893,  0.904,  0.914,
  0.924,  0.933,  0.942,  0.950,  0.957,  0.964,  0.970,  0.976,  0.981,  0.985,  0.989,  0.992,  0.995,  0.997,  0.999,  1.000,
  1.000,  1.000,  0.999,  0.997,  0.995,  0.992,  0.989,  0.985,  0.981,  0.976,  0.970,  0.964,  0.957,  0.950,  0.942,  0.933,
  0.924,  0.914,  0.904,  0.893,  0.882,  0.870,  0.858,  0.845,  0.831,  0.818,  0.803,  0.788,  0.773,  0.757,  0.741,  0.724,
  0.707,  0.690,  0.672,  0.653,  0.634,  0.615,  0.596,  0.576,  0.556,  0.535,  0.514,  0.493,  0.471,  0.450,  0.428,  0.405,
  0.383,  0.360,  0.337,  0.314,  0.290,  0.267,  0.243,  0.219,  0.195,  0.171,  0.147,  0.122,  0.098,  0.074,  0.049,  0.025,
  0.000, -0.025, -0.049, -0.074, -0.098, -0.122, -0.147, -0.171, -0.195, -0.219, -0.243, -0.267, -0.290, -0.314, -0.337, -0.360,
 -0.383, -0.405, -0.428, -0.450, -0.471, -0.493, -0.514, -0.535, -0.556, -0.576, -0.596, -0.615, -0.634, -0.653, -0.672, -0.690,
 -0.707, -0.724, -0.741, -0.757, -0.773, -0.788, -0.803, -0.818, -0.831, -0.845, -0.858, -0.870, -0.882, -0.893, -0.904, -0.914,
 -0.924, -0.933, -0.942, -0.950, -0.957, -0.964, -0.970, -0.976, -0.981, -0.985, -0.989, -0.992, -0.995, -0.997, -0.999, -1.000,
 -1.000, -1.000, -0.999, -0.997, -0.995, -0.992, -0.989, -0.985, -0.981, -0.976, -0.970, -0.964, -0.957, -0.950, -0.942, -0.933,
 -0.924, -0.914, -0.904, -0.893, -0.882, -0.870, -0.858, -0.845, -0.831, -0.818, -0.803, -0.788, -0.773, -0.757, -0.741, -0.724,
 -0.707, -0.690, -0.672, -0.653, -0.634, -0.615, -0.596, -0.576, -0.556, -0.535, -0.514, -0.493, -0.471, -0.450, -0.428, -0.405,
 -0.383, -0.360, -0.337, -0.314, -0.290, -0.267, -0.243, -0.219, -0.195, -0.171, -0.147, -0.122, -0.098, -0.074, -0.049, -0.025,
};


static void filter_rpm( void );
static void apply_voltages( void );

void configure_constants( void )
{
    // estimated L for motor = 35uH
    ls = 0.00036;
    // estimated R for motor = 1.05
    rs = 1.05;
    FREQ_KHZ = FREQ / 1000;

	SCALE_TO_255 = 255.0 / TWO_PI;
	T = 1.0 / FREQ;
	T2 = T * K1 * K1;
	F = 1.0 - ( T * ( rs / ls ));
	G = T / ls;
	TACT = T;
}

void slow_loop( void )
{
    // PWM input to RPM command mapping.
    if (( DutyCycle >= 0 ) && ( DutyCycle <= MAX_DUTY_CYCLE ) ) {
        // PWM input is in the proper range
        // scale to range of magnitudes
        rpm_command_raw = (DutyCycle - PWM_IN_MIN) * 0.01 * (RPM_MAX - RPM_MIN);
    } else {
        rpm_command_raw = 0;
        drivestate = IDLE;
    }
}

void fast_loop( void )
{
	ledctr++;
	// 1 Hz blink
	if ( ledctr > 14000 ) {
		ledctr = 0;
		GPIO_ToggleBits(GPIOD, GPIO_Pin_12);
	}

    // ADC converting.
    // --------------------------------------------------------------------------
    // Sample current sensor ADC channels.                  MAX BITS: UNITS:
    //ib_raw = ( ib_raw >> 1 ) + ((ADC_array[2] - ib_zero) >> 1);
    //ic_raw = ( ic_raw >> 1 ) + (( ADC_array[1] - ic_zero ) >> 1);
    ib_raw = (ADCConvertedValue[0] - ib_zero);
    //ic_raw = (ADC_array[1] - ic_zero);
    ia_raw = (ADCConvertedValue[2] - ia_zero);
    //ia_raw = -ib_raw - ic_raw;

    if ( ! zero_set ) {
	    curra_sum += ia_raw;
    	currb_sum += ib_raw;
    	curr_samples++;
    	return;
    }

    // Ialpha = ia
    // Ibeta = 1.0/V3 * ia + 2.0/V3 * ib
    Ialpha = ia_raw * ADC_CURRENT;
    Ibeta  = (ONE_SQRT3 * Ialpha) + TWO_SQRT3 * ib_raw * ADC_CURRENT;

    // Convert to mV.
    vbus = ADCConvertedValue[1] * ADC_VOLTAGE;

    if ( drivestate > DS_PARK ) {
        filter_rpm();
    }
    apply_voltages();

    medium_counter++;

    // (1kHz slow loop).
    if ( medium_counter > FREQ_KHZ ) {
       slow_loop();
       medium_counter = 0;
    }
}

static void filter_rpm( void )
{
    // New current estimates for ia and ib
	aHat = (F * aHat) + (G * (valpha - bemfa));
	bHat = (F * bHat) + (G * (vbeta - bemfb));

    // Figure out the error of the estimate vs. real thing.
	erra = Ialpha - aHat;
	errb = Ibeta - bHat;

    // Adjust back-emf for a/b with proportional controller
	bemfa = bemfa - (erra * KP);
	bemfb = bemfb - (errb * KP);

	// ek = ( -(bemfa * costheta) - (bemfb * sintheta) )
	ek = -(bemfa * costheta) - (bemfb * sintheta);

    // One measurement per period T
    //wk = wk + (w^2 * ek * (1.0/FREQ)) 
    //a2k = a2k + ( 1/FREQ * wk )
    //rpm = 0.5 * rpm + 0.5 * wk
    //theta = (K2 * wk) + a2k
	wk = wk + (T2 * ek); //  T2 = w^2 * 1/FREQ
	a2k = a2k + (T * wk);

	rpm_measured = (rpm_measured >> 1) + (((int)wk) >> 1 );

    if ( drivestate != DS_RUN ) {
        // In non-run state (ramp?), the angle is decided by the
        // ramp-up algorithm.
    	theta = theta + rpm_desired * TACT;
    	thetak = (K2 * wk) + a2k;

    	theta = fmod( theta, TWO_PI );
    	thetak = fmod( thetak, TWO_PI );

    	v_idx = theta * SCALE_TO_255;
    	v_idxk = thetak * SCALE_TO_255;

        costheta = SINFLUT[(unsigned char)(v_idxk + CHAR_90_DEG)];
        sintheta = SINFLUT[(unsigned char)(v_idxk)];
    } else {
        // in run mode.
    	theta = (K2 * wk) + a2k;
    	theta = fmod( theta, TWO_PI );

    	v_idx = theta * SCALE_TO_255;

        costheta = SINFLUT[(unsigned char)(v_idx + CHAR_90_DEG)];
        sintheta = SINFLUT[(unsigned char)(v_idx)];
    }
}

static void apply_voltages( void )
{
    vsin = SINFLUT[(unsigned char)(v_idx)];
    vcos = SINFLUT[(unsigned char)(v_idx + CHAR_90_DEG)];

    //Idm = Ialpha*cos(theta) + Ibeta * sin(theta)
    //Iqm = -Ialpha*sin(theta) + Ibeta * cos(theta)
    Idm = (Ialpha * vcos) + (Ibeta * vsin);
    Iqm = (-Ialpha * vsin) + (Ibeta * vcos);

    // Valpha = vd*cos(theta) - vq*sin(theta)
    // Vbeta = vd*sin(theta) + vq*cos(theta)
    valpha = (vd * vcos) - (vq * vsin);
    vbeta = (vd * vsin) + (vq * vcos);

    // Va = Valpha
    // Vb = -1/2 * Valpha + V3/2 * Vbeta
    // Vc = -1/2 * Valpha - V3/2 * Vbeta
    va_int = valpha;
    vb = SQRT3DIV2 * vbeta;
    vb_int = -(va_int >> 1) + vb;
    vc_int = -(va_int >> 1) - vb;

    // Load the new PWM values into timer compare buffers.
    // They will be latched at the next timer reset.
    TIM_SetCompare1(TIM1,va_int);
    TIM_SetCompare2(TIM1,vb_int);
    TIM_SetCompare3(TIM1,vc_int);
}

