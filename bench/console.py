import numpy as np
import argparse
import tty, sys
import termios
import select

import math
import sys
import serial
from struct import *
import threading
import sys, tty, termios

UART_BUF_SIZE = 8
X_LIM = 100

class MyConsole():
    def __init__( self, dev ):
        self.ser = serial.Serial( dev, 115200, timeout=1 )
        t = threading.Thread(target=self.read_input)
        t.daemon = True
        t.start()

    def on_timeout( self, userdata ):
        self.receive_uart()
        return True

    def readme( self ):
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return ch

    def read_input( self ):
        while True:
            c = self.readme()
            if ( c == 'c' ):
                break
            if ( c == '+' ):
                self.ser.write( '+' )
            if ( c == '-' ):
                self.ser.write( '-' )

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
        x = self.ser.read( UART_BUF_SIZE )
        if len(x) == UART_BUF_SIZE:
            (calls, end) = unpack( '>ii', x )
            if not end == 0x0000000a:
                self.synchronize()
                return
            if calls > 0:
                print "calls: %d"%( calls )

def main( dev ):
    app = MyConsole( dev )
    while True:
        app.receive_uart()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('dev', help='the USB serial device to use')

    args = parser.parse_args()
    main( args.dev )

