import math

FREQ = 3000
V = 13.3
REALRPM = 305.6
LIMIT = 2
PWM_IN_MIN = 1100
PWM_IN_MAX = 2000
RPM_MAX = 2000.0     # rpm
RPM_MIN = 300.0      # rpm
# GT: Changed constants?
RPM_SLEW = 10000.0    # rpm/s
DT_LOOP = 0.001      # seconds per slow loop
KP_RPM_UP = 0.3       # mA/rpm
KI_RPM = 0.002       # mA/rpm/s
I_SAT_RPM = 20.0    # mA
KFF_I = 4.000e-5   # mA/rpm^2
# KFF_V = 0.00038      # (0-255)/rpm
KFF_V = 0.0      # (0-255)/rpm
AMAX = 20.0    # max accelerating current [A]
BMAX = 5.0     # max braking current [A]

# RPM controller
KP_EST_RPM = 2
KI_EST_RPM = 0.02

KPQ = 1.000 / 500.0   # [LSB/mA/loop] ~= [1V/A/s at 24VDC]
KPD = 0.3   / 500.0   # [LSB/mA/loop] ~= ??? calculate
CHAR_90_DEG = 64

LOOP_INTERVAL = 4

#iafactor   = 0.03         
#ibicfactor = 0.02
iafactor   = 0.03
ibicfactor = 0.02

SQRT3DIV2 = 0.866025404

ONEDIVSQRT3 = 1.0/math.sqrt(3.0)
TWODIVSQRT3 = 2.0/math.sqrt(3.0)

BEMFK = 0.00537
