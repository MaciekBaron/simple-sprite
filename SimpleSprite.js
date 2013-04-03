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

		this.current_frame = 0;
		this.current_loop = 0;
		this.animating = false;
		this.pingpong_direction = 1; // 1 = incrementing frame count, 0 = decrementing frame count
		this.timeout = null;
	}


	SimpleSprite.Sprite.prototype.setLocation = function (x, y) {
		this.x = x;
		this.y = y;

		return this;
	}

	SimpleSprite.Sprite.prototype.draw = function (context) {
		context.drawImage(this.spritesheet, this.current_frame*this.dw, (this.row-1)*this.dh, this.dw, this.dh, this.x, this.y, this.dw, this.dh);
		return this;
	}

	SimpleSprite.Sprite.prototype.isAnimating = function () {
		return this.animating;
	}

	SimpleSprite.Sprite.prototype.startAnimation = function (callback) {
		if (!this.animating) {
			this.animating = true;
			this.animate();
		}

		if (typeof callback == "function") {
			this.callback = callback;
		}

		return this;
	}

	SimpleSprite.Sprite.prototype.stopAnimation = function () {
		this.animating = false;
		clearTimeout(this.timeout);

		return this;
	}

	SimpleSprite.Sprite.prototype.resetAnimation = function () {
		this.current_frame = 0;
		return this;
	}

	SimpleSprite.Sprite.prototype.animate = function () {
		if (this.animating == true) {
			if (this.pingpong) {
				if (this.pingpong_direction == 1) {
					this.current_frame++;
					if (this.current_frame == this.total_frames) {
						this.current_frame -= 2;
						this.pingpong_direction = 0;
					}
				} else {
					this.current_frame--;
					if (this.current_frame == -1) {
						this.current_frame = 1;
						this.pingpong_direction = 1;

						this.current_loop++;

						if (typeof this.callback === "function") this.callback();
					}
				}
			} else {
				this.current_frame++;
				if (this.current_frame == this.total_frames) {
					if (typeof this.callback === "function") this.callback();
					this.current_loop++;

					this.current_frame = 0;
				}
			}
			var self = this;
			this.timeout = setTimeout(function() { self.animate() }, this.interval);
		} else {
			this.current_frame = 0;
		}
		return this;
	}
})(window.SimpleSprite = window.SimpleSprite || {});
