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

  // Helper function
	var throwError = function(err) {
		throw new Error(err);
	};

	// Private variables

	var current_frame = 0;
	var current_loop = 0;
	var animating = false;
	var pingpong_direction = 1; // 1 = incrementing frame count, 0 = decrementing frame count
	var timeout = null;

	SimpleSprite.Sprite = function (settings, callback) {

		this.spritesheet = (settings.spritesheet) ? settings.spritesheet : throwError("No spritesheet provided");
		this.x = (settings.x) ? settings.x : 0;	// Destination x
		this.y = (settings.y) ? settings.y : 0; // Destination y
		this.dw = (settings.width) ? settings.width : throwError("No width provided");	// Width of the frame
		this.dh = (settings.height) ? settings.height : throwError("No height provided");// Height of the frame
		this.row = (settings.row) ? settings.row : 1;	// Row in spritesheet
		this.interval = (settings.interval) ? settings.interval : 100; // Interval between frames
		this.total_frames = (settings.frames) ? settings.frames : throwError("No frame count provided");
		this.pingpong = (settings.pingpong) ? settings.pingpong : false;
		this.loops = (settings.loops) ? settings.loops : 0; // number of loops (0 = infinite)
		this.callback = callback;
	}


	SimpleSprite.Sprite.prototype = {
		setLocation: function (x, y) {
			this.x = x;
			this.y = y;

			return this;
		},

		draw: function (context, x, y) {
			var dx = (typeof x == "number") ? x : this.x;
			var dy = (typeof y == "number") ? y : this.y;
			context.drawImage(this.spritesheet, current_frame*this.dw, (this.row-1)*this.dh, this.dw, this.dh, dx, dy, this.dw, this.dh);
			return this;
		},

		isAnimating: function () {
			return animating;
		},

		startAnimation: function (callback) {
			if (!animating) {
				animating = true;
				this.animate();
			}

			if (typeof callback == "function") {
				this.callback = callback;
			}

			return this;
		},

		stopAnimation: function () {
			animating = false;
			clearTimeout(timeout);

			return this;
		},

		resetAnimation: function () {
			current_frame = 0;
			return this;
		},

		animate: function () {
			if (animating == true) {
				if (this.loops != 0 && current_loop == this.loops) {
					this.stopAnimation();
				} else {
					if (this.pingpong) {
						if (pingpong_direction == 1) {
							current_frame++;
							if (current_frame == this.total_frames) {
								current_frame -= 2;
								pingpong_direction = 0;
							}
						} else {
							current_frame--;
							if (current_frame == -1) {
								current_frame = 1;
								pingpong_direction = 1;

								current_loop++;

								if (typeof this.callback === "function") this.callback();
							}
						}
					} else {
						current_frame++;
						if (current_frame == this.total_frames) {
							if (typeof this.callback === "function") this.callback();
							current_loop++;

							current_frame = 0;
						}
					}
					timeout = setTimeout((function() { this.animate(); }).bind(this), this.interval);
				}
			} else {
				current_frame = 0;
			}
		}
	}
})(window.SimpleSprite = window.SimpleSprite || {});
