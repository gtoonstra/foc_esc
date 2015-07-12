from gi.repository import Gtk, Gdk, GObject

class Graph2(Gtk.DrawingArea):
    def __init__ (self, ymin, ymax):
        Gtk.DrawingArea.__init__(self)
        self.set_size_request( 1024, 200 )
        self.scale = 200.0 / (ymax+abs(ymin))
        self.mid = ymax * self.scale
        self.connect("draw", self.draw)
        self.connect("configure_event", self.configure_event)
        self.a1 = [self.mid] * 1024
        self.a2 = [self.mid] * 1024

    # Create a new backing pixmap of the appropriate size
    def configure_event(self, widget, event):
        rect = widget.get_allocation()
        return True

    def append( self, v1, v2 ):
        self.a1.pop(0)
        self.a1.append( self.mid - v1 * self.scale )
        self.a2.pop(0)
        self.a2.append( self.mid - v2 * self.scale )
        self.queue_draw()

    # Redraw the screen from the backing pixmap
    # This method calls the operations going on in the model
    def draw( self, widget, cr):
        rect = widget.get_allocation()

        cr.set_line_width(0.5)
        cr.set_source_rgb(1.0, 0, 0)
        cr.move_to( 0, self.a1[0] )
        for i in range(1, len(self.a1)):
            cr.line_to( i, self.a1[ i ] )
        cr.stroke()

        cr.set_source_rgb(0.0, 1.0, 0)
        cr.move_to( 0, self.a2[0] )
        for i in range(1, len(self.a2)):
            cr.line_to( i, self.a2[ i ] )
        cr.stroke()

        return True

class Graph3(Gtk.DrawingArea):
    def __init__ (self, ymin, ymax):
        Gtk.DrawingArea.__init__(self)
        self.set_size_request( 1024, 200 )
        self.scale = 200.0 / (ymax+abs(ymin))
        self.mid = ymax * self.scale
        self.connect("draw", self.draw)
        self.connect("configure_event", self.configure_event)
        self.a1 = [self.mid] * 1024
        self.a2 = [self.mid] * 1024
        self.a3 = [self.mid] * 1024

    # Create a new backing pixmap of the appropriate size
    def configure_event(self, widget, event):
        rect = widget.get_allocation()
        return True

    def append( self, v1, v2, v3 ):
        self.a1.pop(0)
        self.a1.append( self.mid - v1 * self.scale )
        self.a2.pop(0)
        self.a2.append( self.mid - v2 * self.scale )
        self.a3.pop(0)
        self.a3.append( self.mid - v3 * self.scale )
        self.queue_draw()

    # Redraw the screen from the backing pixmap
    # This method calls the operations going on in the model
    def draw( self, widget, cr):
        rect = widget.get_allocation()

        cr.set_line_width(0.5)
        cr.set_source_rgb(1.0, 0, 0)
        cr.move_to( 0, self.a1[0] )
        for i in range(1, len(self.a1)):
            cr.line_to( i, self.a1[ i ] )
        cr.stroke()

        cr.set_source_rgb(0.0, 1.0, 0)
        cr.move_to( 0, self.a2[0] )
        for i in range(1, len(self.a2)):
            cr.line_to( i, self.a2[ i ] )
        cr.stroke()

        cr.set_source_rgb(0.0, 0.0, 1.0)
        cr.move_to( 0, self.a3[0] )
        for i in range(1, len(self.a3)):
            cr.line_to( i, self.a3[ i ] )
        cr.stroke()

        return True
