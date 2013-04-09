/*
The MIT License (MIT)
--

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

*/
;(function (SimpleSprite, undefined) {

	SimpleSprite.Collection = function() {
		this.sprites = {};
		this.x = 0;
		this.y = 0;
	}

	var sortFunction = function (a, b) {
		return a.z - b.z;
	}


	SimpleSprite.Collection.prototype = {
		addSprite: function(name, sprite) {

			["offsetX", "offsetY", "z"].forEach(function(attr) {
				if (typeof sprite[attr] != "number") {
					sprite[attr] = 0;
				}
			});

			this.sprites[name] = sprite;

			return this;
		},

		getSprite: function(name) {
			return this.sprites[name];
		},

		draw: function(context, x, y) {
			var dx = (typeof x == "number") ? x : this.x;
			var dy = (typeof y == "number") ? y : this.y;

			var spriteArray = [];

			for (var name in this.sprites) {
				if (this.sprites[name] instanceof SimpleSprite.Sprite) {
					spriteArray.push(this.sprites[name]);
				}
			}

			spriteArray.sort(sortFunction);

			spriteArray.forEach(function(sprite) {
				sprite.draw(context, dx + sprite.offsetX, dy + sprite.offsetY);
			});

			return this;
		},

		setLocation: function(x, y) {
			this.x = x;
			this.y = y;

			return this;
		}
	}

})(window.SimpleSprite = window.SimpleSprite || {});
