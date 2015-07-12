#include "stm32f4_discovery.h"
#include <stdio.h>
#include "stm32f4xx_adc.h"

#include "config.h"
#include "vars.h"

__IO uint16_t ADCConvertedValue[4];
__IO uint32_t DutyCycle;
__IO uint32_t Frequency;

int main(void) {
	config();

	while (1) {
		static int i;

		for (i = 0; i < 1000000; ++i)
			;
        printf("%u %u %u %u %u %u\n", currentTime, ADCConvertedValue[0], ADCConvertedValue[1], ADCConvertedValue[2], ADCConvertedValue[3], fastfreq );

		//GPIO_ToggleBits(GPIOD, GPIO_Pin_12 | GPIO_Pin_13 | GPIO_Pin_14 | GPIO_Pin_15);
		GPIO_ToggleBits(GPIOD, GPIO_Pin_15);
	}
}
