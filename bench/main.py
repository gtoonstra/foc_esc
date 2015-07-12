from gi.repository import Gtk, Gdk, GObject

import numpy as np
import drawingarea
import argparse

import math
import sys
import serial
from struct import *

UART_BUF_SIZE = 84
X_LIM = 100

# Fix16 scaling factor
SCALE = 65536.

# Fix16 overflow indicator
OVERFLOW = -2**31

def f16_to_float(val):
    return float(val) / SCALE

def float_to_f16(val):
    val = int(round(val * SCALE))
    if val >= 2**31 or val < -2**31:
        val = OVERFLOW
    return val

class Display(Gtk.Window):
    def __init__ (self, dev):
        Gtk.Window.__init__(self)

        self.rpma = drawingarea.Graph2( -2000, 2000 )
        self.curra = drawingarea.Graph3( -20000, 20000 )

        vbox = Gtk.VBox()
        self.add(vbox)

        vbox.pack_start(self.rpma, True, True, 0)
        vbox.pack_start(self.curra, True, True, 0)

        hbox = Gtk.HBox()
        self.voltsl = self.add_label( "volts: ", hbox )
        self.pwm_inl = self.add_label( "pwm: ", hbox )
        self.iqrl = self.add_label( "Iqreq: ", hbox )
        self.vql = self.add_label( "Vq: ", hbox )
        self.vdl = self.add_label( "Vd: ", hbox )
        vbox.pack_start(hbox, True, True, 0)

        hbox = Gtk.HBox()
        plusbtn = Gtk.Button( "+" )
        plusbtn.connect( "clicked" , self.addpwm )
        hbox.pack_start( plusbtn, True, True, 0 )
        minbtn = Gtk.Button( "-" )
        minbtn.connect( "clicked" , self.subtractpwm )
        hbox.pack_start( minbtn, True, True, 0 )
        self.graph = False
        graphbtn = Gtk.Button( "graph" )
        graphbtn.connect( "clicked" , self.toggle_graph )
        hbox.pack_start( graphbtn, True, True, 0 )

        vbox.pack_start(hbox, True, True, 0)
        # Create toolbar
        #toolbar = NavigationToolbar(self.canvas, self)
        #vbox.pack_start(toolbar, False, False, 0)

        self.connect_after('destroy', self.destroy)

        #self.set_size_request (200, 200)
        self.ser = serial.Serial( dev, 57600, timeout=1 )
        self.synchronize()
        self.show_all()  

    def toggle_graph( self, btn ):
        self.graph = not self.graph
        btn.set_label( "Graph: %d"%( self.graph ) )

    def add_label( self, labelname, hbox ):
        ln = Gtk.Label( labelname )
        vlabel = Gtk.Label( "0.00" )
        hbox.pack_start( ln, True, True, 0 )
        hbox.pack_start( vlabel, True, True, 0 )
        return vlabel

    def addpwm( self, btn ):
        self.ser.write( '+' )

    def subtractpwm( self, btn ):
        self.ser.write( '-' )

    def destroy(self,window):
        Gtk.main_quit()

    def on_timeout( self, userdata ):
        self.receive_uart()
        return True

    def synchronize( self ):
        # synchronize first
        x3 = 0xFF
        x2 = 0xFF
        x1 = 0xFF
        x = 0xFF

        while True:
            x3 = x2
            x2 = x1
            x1 = x
            x = self.ser.read(1)
            if x == '\n' and x1 == '\0' and x2 == '\0' and x3 == '\0':
                break

    def receive_uart( self ):
        if ( self.ser.inWaiting() <= 0 ):
            return
        x = self.ser.read( UART_BUF_SIZE )
        if ( len(x) == UART_BUF_SIZE ):
            (self.volts, self.Ialpha, self.Ibeta, self.aHat, self.idm, self.iqm, self.rpm, self.bemfa, self.vidx, self.vq, self.vd, self.valpha, self.vbeta, self.rpm_command, self.pwm_in, self.iqr, self.va, self.vb, self.vc, self.extra, self.end) = unpack( '>iiiiiiiiiiiiiiiiiiiii', x )
            if not self.end == 0x0000000a:
                self.synchronize()
                return

            self.rpma.append( self.rpm, self.rpm_command )
            self.curra.append( f16_to_float( self.Ialpha ) * 1000, f16_to_float( self.Ibeta ) * 1000, 0 )

            self.voltsl.set_text( "%04.3f"%(self.volts/1000.0) )
            self.pwm_inl.set_text( "%d"%(self.pwm_in) )
            self.iqrl.set_text( "%d"%(self.iqr) )
            self.vql.set_text( "%d"%(self.vq) )
            self.vdl.set_text( "%d"%(self.vd) )

            print "ialpha: %f, ibeta: %f, reqrpm: %d, mesrpm: %d, iqm: %f, idm: %f, valpha: %f, vbeta: %f, vq: %d, vd: %d, bemfa: %f, extra: %d"%( f16_to_float( self.Ialpha ), f16_to_float( self.Ibeta ), self.rpm_command, self.rpm, f16_to_float( self.iqm ), f16_to_float( self.idm ), f16_to_float( self.valpha ), f16_to_float( self.vbeta ), self.vq, self.vd, f16_to_float( self.bemfa ), self.extra )

            #print "%f, %f, %f, %f, %f"%( f16_to_float( self.Ialpha ), f16_to_float( self.Ibeta ), f16_to_float(self.extra), f16_to_float( self.iqm ), f16_to_float( self.idm ))

def main( dev ):
    app = Display( dev )
    GObject.timeout_add(20, app.on_timeout, None)
    Gtk.main()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('dev', help='the USB serial device to use')

    args = parser.parse_args()
    main( args.dev )

