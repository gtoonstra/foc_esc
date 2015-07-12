#!/usr/bin/env python
"""
Based on cairo-demo/X11/cairo-demo.c
"""
from gi.repository import Gdk, Gtk, GObject
from graph import Graph
from simulator import Simulator
import constants

t = 0.0
n = 0
sim = None
graph = None
pwm = None

def main():
    win = Gtk.Window()
    win.connect('destroy', lambda w: Gtk.main_quit())
    win.set_default_size(800, 650)
  
    global graph, sim, pwm

    vbox = Gtk.VBox()
    win.add(vbox)

    graph = Graph()
    vbox.pack_start(graph, True, True, 0)

    hbox = Gtk.HBox()
    plusbtn = Gtk.Button( "+" )
    plusbtn.connect( "clicked" , addpwm )
    hbox.pack_start( plusbtn, True, True, 0 )
    minbtn = Gtk.Button( "-" )
    minbtn.connect( "clicked" , subtractpwm )
    hbox.pack_start( minbtn, True, True, 0 )
    pwm = add_label( "pwm: ", hbox )

    vbox.pack_start(hbox, False, False, 0)
    sim = Simulator()

    GObject.timeout_add( 5, callback )

    win.show_all()
    Gtk.main()

    print "bye!"

def callback():
    global t, n, sim, graph, pwm

    t = t + 1.0 / constants.FREQ
    n = n + 1

    pwm.set_text( "%d"%(sim.getPwm()) )

    # t = t in s after last step
    a,b,c,d,e,f,g,h = sim.step_sim( t, n )
    graph.update_lists( a,b,c,d,e,f,g,h )
    graph.queue_draw()

    return True

def add_label( labelname, hbox ):
    ln = Gtk.Label( labelname )
    vlabel = Gtk.Label( "0.00" )
    hbox.pack_start( ln, True, True, 0 )
    hbox.pack_start( vlabel, True, True, 0 )
    return vlabel

def addpwm( btn ):
    global sim
    sim.movepwm(1)

def subtractpwm( btn ):
    global sim
    sim.movepwm(-1)

if __name__ == '__main__':
    main()

