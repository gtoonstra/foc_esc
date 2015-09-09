# Field Oriented Control

FOC is an algorithm used to run motors with several benefits:

* they run more quiet 
* they produce less vibrations, because the torque ripple is lower
* they are more efficient (some people report even 25% improvement)
* One report indicates a 100% improvement at very low rpm.

## Why?

I tried creating this ESC for about a year now and the hardware consistently had issues:

* No voltage for the 3.3v system / processor
* The processor couldn't be programmed
* Lots of noise on the ADC parts.

It is too expensive for me to continue, given the track record of the project.

Looking at the repository however, I think it's important to opensource it, because regardless of the hardware (and the video below), it's clear I got pretty close.

What's most interesting probably are three parts: the algorithms.c code, the documentation in the docs folder (I scoured this together on the inet, browsing for ages and clicking links everywhere) and the simulator with the FOC implementation that suggests the algorithm should actually work.

So I hope that someone else with better means to create electronics can use this information and put a working FOC ESC together.

## Did none of it work?

Yes, there have been boards that worked, but the noise on ADC was too high for the algorithm to work reliably and the processor was not powerful enough. A video is here:

https://www.youtube.com/watch?v=6R9PgWKNlGw

Oh, and here's the simulator at work:

https://www.youtube.com/watch?v=rsVllHhEW88

The biggest issues and hints:

1.  I could not get the buck/boost in the DRV8301/2 chips to work reliably. 8 out of 10 boards failed, because it didn't produce 5V or it couldn't handle the current load.
2.  Depending on how the board is routed, you may get a lot of noise in the ADC channels. One of the versions used separation of analog and digital for the processor, but that really got in the way. It seems best to simply connect analog and digital together, because that's the reference the DRV chips use. 
3.  Routing the analog signals where the current is measured at the resistor needs a lot of attention. The GND and signal track need to have similar length and be routed away from interference. 
4.  Separate high power from digital. In the latest design, the current sensor (resistors) are in the middle of the board with the mosfets to the right.
5.  Using separate components rather than the chip could bring benefits. This allows you to get current sensing amplifiers very close to where the signals are generated with minimum trace and then use the amplified signal (10x?) instead, which significantly reduces noise seen at the cpu.

## What's in here?

bench: A utility to receive motor telemetry over UART in python and plotting it on a UI.
control_schema: A schematic explanation how FOC works
docs: Loads, loads and loads of docs... about FOC in general, reports, simulation and datasheets for components that were used.
escsim: A simulator for a brushless DC motor (BLDC), without an algorithm controlling it.
escsw-coocox: A preliminary implementation in coocox for the motor controller. Here you have the "algorithm" in algorithms.c
foc_simulation: Implementation of the algorithm in python to use it with the simulator
hardware: Some schematics of the hardware to build the ESC. 

## Can I ask questions?

Try to raise an issue in this repository, so that some common questions get answered. But I consider this thing done and dusted, I'm moving on.

## Is anyone making one right now?

By my knowledge this project is pretty active. It's a bit focused towards higher power ESC (so maybe not immediately useful for quads), but for wings and skateboards, should be good:

http://vedder.se/

I learned from this blog here too:

http://scolton.blogspot.com.br/p/motor-controllers.html

There are other ESC's to look at:

- pxESC (has CAN implementation!)
- ESC32

There also exist some ESC's that are not widely known at all, mostly home-built electronics projects.
