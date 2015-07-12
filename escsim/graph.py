import cairo
from gi.repository import Gdk, Gtk

SIZE = 30

class Graph(Gtk.DrawingArea):

    def __init__ (self):
        Gtk.DrawingArea.__init__(self)
        self.connect('draw', self.draw)

        self.l1 = []
        self.l2 = []
        self.l3 = []
        self.l4 = []
        self.l5 = []
        self.l6 = []
        self.l7 = []
        self.l8 = []

    def update_lists( self, a, b, c, d, e, f, g, h ):
        self.l1.append( a )
        self.l2.append( b )
        self.l3.append( c )
        self.l4.append( d )
        self.l5.append( e )
        self.l6.append( f )
        self.l7.append( g )
        self.l8.append( h )
        if ( len(self.l1) > 780 ):
            del self.l1[0]    
            del self.l2[0]
            del self.l3[0]
            del self.l4[0]
            del self.l5[0]
            del self.l6[0]
            del self.l7[0]
            del self.l8[0]
      
    def draw_line( self, ctx, l ):
        for i in xrange(len( l )):
            ctx.line_to( i, l[i] )

    def draw_lines(self,ctx ):
        ctx.translate( 10, 50 )
        ctx.set_source_rgb(0, 0, 0)
        self.draw_line( ctx, self.l1 )
        ctx.stroke()
        ctx.set_source_rgb(0, 0, 1)
        self.draw_line( ctx, self.l2 )
        ctx.stroke()
        ctx.translate( 0, 150 )
        ctx.set_source_rgb(0, 0, 0)
        self.draw_line( ctx, self.l3 )
        ctx.stroke()
        ctx.set_source_rgb(0, 1, 0)
        self.draw_line( ctx, self.l4 )
        ctx.stroke()
        ctx.translate( 0, 150 )
        ctx.set_source_rgb(0, 0, 0)
        self.draw_line( ctx, self.l5 )
        ctx.stroke()
        ctx.set_source_rgb(1, 0, 0)
        self.draw_line( ctx, self.l6 )
        ctx.stroke()
        ctx.translate( 0, 150 )
        ctx.set_source_rgb(0, 0, 0)
        self.draw_line( ctx, self.l7 )
        ctx.stroke()
        ctx.set_source_rgb(1, 0, 1)
        self.draw_line( ctx, self.l8 )
        ctx.stroke()

    def draw(self, da, ctx):
        ctx.scale( 1.0, 1.0 )
        ctx.set_line_width(1)
        self.draw_lines( ctx )


