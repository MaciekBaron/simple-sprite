Simple Sprite
=============

**SimpleSprite** is a basic sprite library used for framerate independent spritesheet based animations 
that I have developed during my first [GameHack](http://gamehack.co.uk/) event and have been using 
it ever since whenever I work on a 2D sprite-based game during such events (i.e. most of the time). 
If you don't need anything fancy and just want to animate a sprite, this is the library for you.

Tutorial
--------
First, create an an image and a Sprite:

     var myFile = new Image();
     var myFile.src = "some-file.png";
     var mySprite = new SimpleSprite.Sprite({
                      spritesheet: myFile, 
                      width: 20, 
                      height: 20, 
                      frames: 4
     });

This is the most basic example where you set the spritesheet file, then the width and height of each 
frame, and finally the total number of frames. Note that the library does not take care of loading 
files - you have to load the files yourself, but thanks to this you can use the same file with multiple 
sprites.

There are other settings you can use in the Sprite's "constructor":

* `x`, `y` - initial x and y coordinates, defaults to 0
* `row` - defines which row to use in your image file (if your file has multiple rows, e.g. a character 
facing multiple directions), defaults to 1
* `interval` - interval between frames, defaults to 100
* `pingpong` - decides whether the animations is a "pingpong" one (i.e. an animation that goes back and 
forth), defaults to `false`
* `loop` - defines the number of loops the animation should perform, defaults to 0 (infinite)

The second argument of the "constructor" can be a callback function that is called after the animation 
has finished.

After we've created our Sprite, we want to start animating it:
    
    mySprite.startAnimating();
    
Note that the animation is indipendent from your drawing, i.e. it happens even if you're not drawing the 
sprite. This is a simplification that can have its drawbacks (e.g. uneven frames) but shouldn't cause any 
visual glitches if used properly.

Next we need to draw our sprite:

    mySprite.draw(context);
    
Where `context` is a 2D Canvas context that you get by calling `yourCanvasElement.getContext("2d")`. Note 
that `draw()` should be called within your rendering loop, so that the sprite is redrawn on every frame.

Demo
----
[Really (really) simple demo](http://htmlpreview.github.com/?http://github.com/MaciekBaron/simple-sprite/blob/master/example/index.html)
