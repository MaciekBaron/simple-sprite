SimpleSprite
=============

**SimpleSprite** is a lightweight sprite library used for [Canvas](http://en.wikipedia.org/wiki/Canvas_element) 
framerate independent spritesheet based animations that I have developed during my first 
[GameHack](http://gamehack.co.uk/) event and have been using it ever since whenever I work on a 2D sprite-based 
game during such events (i.e. most of the time). Its functionality can be extended by using additional 
[modules](#optional-modules). If you don't need anything fancy and just want to animate a sprite, this is the 
library for you.

Tutorial
--------
### Creating sprites
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
sprites. You can also use the optional [SimpleSpriteContainer](#simplespritecontainer).

There are other settings you can use in the Sprite's "constructor":

* `x`, `y` - initial x and y coordinates, defaults to 0
* `row` - defines which row to use in your image file (if your file has multiple rows, e.g. a character 
facing multiple directions), defaults to 1
* `interval` - interval between frames, defaults to 100
* `pingpong` - decides whether the animations is a "pingpong" one (i.e. an animation that goes back and 
forth), defaults to `false`
* `loop` - defines the number of loops the animation should perform, defaults to 0 (infinite)

The second argument of the "constructor" can be a callback function that is called after every loop.

After we've created our Sprite, we want to start animating it:
    
    mySprite.startAnimation();
    
Note that the animation is indipendent from your drawing, i.e. it happens even if you're not drawing the 
sprite. This is a simplification that can have its drawbacks (e.g. uneven frames) but shouldn't cause any 
visual glitches if used properly.

Next we need to draw our sprite:

    mySprite.draw(context);
    
Where `context` is a 2D Canvas context that you get by calling `yourCanvasElement.getContext("2d")`. Note 
that `draw()` should be called within your rendering loop, so that the sprite is redrawn on every frame.

### Moving sprites
Obviously sprites that just sit there and don't move aren't very useful. We can change the location of our 
sprite by simple calling the `setLocation(x, y)` function:

    mySprite.setLocation(123, 321);

If you prefer, you can set the destination when drawing the sprite:

    mySprite.draw(context, x, y);
    
### Controling the animation
The SimpleSprite object has three self-explainatory functions that control the animation:

    mySprite.startAnimation();
    mySprite.stopAnimation();
    mySprite.resetAnimation();
    
`resetAnimation()` will return to the first frame of the animation, it will neither pause or play the animation.

### Tips and suggestions
If you are working on a "topdown" game and want your character to face different directions, you can prepare 
several rows of animations in one file, and then change the row in your sprite like so:

    mySprite.row = 2; // Left
    mySprite.row = 3; // Right
    // etc..

You could also try using the SpriteState module (more about it below).

Optional modules
----------------
### SimpleSpriteContainer
If you also want a simple image container, you can include the optional `SimpleSpriteContainer.js` script. It is a 
very simple script that holds all your image objects. This is how it works:

    var mySpriteContainer = new SimpleSprite.ImageContainer("./img-location/");
    
    // Get file named 'sprite.png'
    mySpriteContainer.getImage('sprite.png');
    
Whenever you call `getImage(filename)`, the script will check whether we have already loaded that file and return it. 
This means that you can always call `getImage(filename)` and it won't reload the file, just return the "cached" file.

You can also define a callback which is called once the image is loaded:

     mySpriteContainer.getImage('sprite.png', function () {
          console.log("The image has been loaded!");
     });

### SimpleSpriteStates
This module adds the ability to create certain states for your sprite and switch between them. You can also create state
"templates" from which your sprite can iherit available states (note that this overwrites all known states, if you want 
to add states without overwriting, use `learnStates()`, but remember that this of course still will overwrite states with 
the same names). Here's an example that can explain more:

    var simpleStateTemplate = new SimpleSprite.StateTemplate({
        slowState: {
            interval: 300
        },
        fastState: {
            interval: 50
        }
    });

    mySprite.inheritStates(simpleStateTemplate);

This creates a state template with two possible states, `slowState` and `fastState`. As you can see both change the 
interval between frames. You can change any attribute of your Sprite object using those states. Sprites can inherit 
states from templates or from other sprites.

To change the state of the sprite simply call `changeToState(name)`:

    mySprite.changeToState("fastState"); // Speeds up the animation
    console.log(mySprite.currentState);  // Returns "fastState"

A good use of states is to change the current row sued from the spritesheet depending on which way the character is 
facing.

Of course your states can be more complicated than in the above example:

    var simpleStateTemplate = new SimpleSprite.StateTemplate({
        fancyState: {
            x: (myCanvas.width-100),
            y: 0,
            row: 2,
            interval: 300,
            pingpong: true
        }
    });

### SimpleSpriteCollection
This module helps rendering collections of sprites that are connected to each other in some way (think of a character 
that has a head, torso, legs etc.).

First create a new collection:

    var mySpriteCollection = new SimpleSprite.Collection();
    
We then need to add sprites to our collection by using `addSprite(name, sprite)`:

    someSprite.z = 1;
    
    someOtherSprite.z = 2;
    someOtherSprite.offsetX = -10;
    
    mySpriteCollection.addSprite("first", someSprite).addSprite("second", someOtherSprite);
    
The above code specifies that `someSprite` has a lower "`z`" than `someOtherSprite`, which means it will be 
drawn before (i.e. behind) `someOtherSprite`. We are also ofsetting `someOtherSprite` by 10 pixels to the left.

Finally, we draw our collection:

    mySpriteCollection.draw(context);
    
We can set the location of the collection in the same way we do it with sprites by using `setLocation()` or 
when calling the `draw()` function.

Q&A
---
###What do you mean by "framerate independent"?
It doesn't matter how many times you draw to the canvas, the speed of the animation won't change. That's because the 
frames of the animation are switched independently.

###What are the drawbacks of such approach?
You need to take care of syncing the animations (if you want them to be perfectly synced with each other).

###Is this library suitable for game X?
The library is very simple and lightweight and thus can fit any game with sprite based graphics.

###What are the dependencies?
There are no dependencies, other than having a browser that supports the Canvas element of course.

Demo
----
[Really (really) simple demo](http://htmlpreview.github.com/?http://github.com/MaciekBaron/simple-sprite/blob/master/example/index.html)

Licence
-------
###The MIT License (MIT)

Copyright © 2013 Maciej Baron

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the “Software”), to deal in the Software without restriction, including without 
limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the 
Software, and to permit persons to whom the Software is furnished to do so, subject to the following 
conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
