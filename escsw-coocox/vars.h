#ifndef VARS_H
#define VARS_H

#define GTDEBUG	1

#define DS_IDLE		0
#define DS_PARK		1
#define DS_RAMP		2
#define DS_RUN		3

extern uint32_t currentTime;
extern uint32_t fastcounter;
extern uint32_t fastfreq;

extern __IO uint32_t DutyCycle;
extern __IO uint32_t Frequency;
extern __IO uint16_t ADCConvertedValue[4];

extern float Ialpha;
extern float Ibeta;
extern float valpha;
extern float vbeta;
extern float vbus;
extern int   drivestate;
extern float theta;
extern float Iqm;
extern float Idm;
extern float vq;
extern float vd;

#endif
