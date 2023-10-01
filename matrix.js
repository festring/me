var app = {
  canvas: document.getElementById('canvas'),
  ctx: this.canvas.getContext('2d'),
  animFrame: 0,
  animSpeed: 2,
  fontHeight: 16,
  alpha: ["ሧ", "可", "ራ", "女", "日", "の", "ㅛ", "を", "ん", "た", "ㅎ", "儿", "吉", "に"],
  trail: [],
  letters: [],
  Letter: function(x, y, l, r, g, b, a) {//constructor
    this.getX = function() {
      var l = app.letters;
      var newX = Math.floor((Math.random() * app.canvas.width - app.fontHeight * 2) + app.fontHeight * 2);
      for (var i = 0; i < l.length; i++) {
        if (newX >= l[i].x - app.fontHeight * 2.5 && newX <= l[i].x + app.fontHeight * 2.5) {
          return this.getX();
        } else {
          return newX;
        }
      }
    };
    this.x = x || Math.floor((Math.random() * app.canvas.width - app.fontHeight * 2) + app.fontHeight * 2)
    this.y = y || Math.random() * app.canvas.height*0.1;
    this.char = l || app.alpha[Math.floor(Math.random() * app.alpha.length)];
    this.r = r || 255;
    this.g = g || 255;
    this.b = b || 255;
    this.a = a || 1;
    this.color = function() {
      return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };
    this.hitPercent = 0.25;
    this.hitTest = function(percent) {//chance generator
      var chance = Math.random();
      if (chance < percent) {
        return true;
      } else {
        return false;
      }
    }
  },
  getLetters: function() {//fill array based on canvas width
    if (this.canvas.width > 450) {
      for (var i = 0; i < Math.floor(this.canvas.width / this.fontHeight * 0.08); i++) {
        this.letters.push(new this.Letter());
      }
    } else {
      for (var i = 0; i < Math.floor(this.canvas.width / this.fontHeight * 0.26); i++) {
        this.letters.push(new this.Letter());
      }
    }
  },
  initialize: function() {//start application
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight*0.1;
    window.addEventListener("resize", function(){//keep canvas sized to the window
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight*0.1;
    });
    this.getLetters();
    this.draw();
  },
  update: function() {//redraw
    this.animFrame++;
    for (var i = 0; i < this.letters.length; i++) {//draw leading letters
      var l = this.letters[i];
      this.ctx.fillStyle = l.color();
      this.ctx.font = this.fontHeight + "px Courier New";
      this.ctx.textAlign = "center";
      this.ctx.fillText(l.char, l.x, l.y);
      l.char = this.alpha[Math.floor(Math.random() * this.alpha.length)];
      l.y += this.animSpeed;     
      
      if (l.y > this.canvas.height + this.fontHeight / Math.random() * 2) {//when leading letter falls off canvas
        l.x = l.getX();
        l.y = this.fontHeight;
      }
      
      if (this.animFrame % Math.floor((this.fontHeight + 1) / this.animSpeed) === 0) {
        this.trail.push(new this.Letter(l.x, l.y, l.char));
        this.animFrame = 0;
      }
    }    
    for (var i = 0; i < this.trail.length; i++) {//draw following letters
      var t = this.trail[i];
      this.ctx.fillStyle = t.color();
      this.ctx.fillText(t.char, t.x, t.y);
      t.a -= Math.random() * 0.01 * this.animSpeed;
      t.r -= 20;
      t.b -= 20;
      t.hitPercent = t.hitPercent * ((Math.random() * 2 + 8) / 10);      
      if (t.hitTest(t.hitPercent)) {//occassionally change trailing characters
        t.char = app.alpha[Math.floor(Math.random() * app.alpha.length)];
      }      
      if (t.a <= 0) {//trim faded symbols from array
        var index = this.trail.indexOf(t);
          this.trail.splice(index, 1);
      }
    }
  },
  draw: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.update();//redraw
    window.requestAnimationFrame(this.draw.bind(this));//repeat
  }
};
window.onload = app.initialize();//start application