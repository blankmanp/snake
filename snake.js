(function () {
	/*全局变量*/
	var g = {
		//获得or设置盒子的attribute
		attr : function (x, y, att, name) {
			var d = document.getElementById("box_" + x + "_" + y);
			if (d && name)
				d.setAttribute(att, name);
			else if (d)
				return d.getAttribute(att);
		},
		//随机创建点
		create : function (start, end) {
			return Math.floor(Math.random() * (end - start) + start);
		},
		//运动方向
		direction : {
			left : 37,
			up : 38,
			right : 39,
			down : 40
		},
		//游戏设定
		setting : {
			size : 20,
			speed : 500,
			len : 3,
			func : null,
			direct : null
		}
	}
	/*Game构造器*/
	function Game () {
	};
	/*创建格子*/
	Game.prototype.pannel = function () {
		var t = [];
		t.push("<table>");
		for (var i = 0; i < g.setting.size; i ++) {
			t.push("<tr class = 'row' y = " + i + ">");
			for (var j = 0; j < g.setting.size; j ++) {
				t.push("<td id = 'box_" + j + "_" + i + "' inside = ' '></td>");
			}
			t.push("</tr>");
		}
		t.push("</table>");
		document.getElementById("pannel").innerHTML = t.join("");
	};
	/*初始化游戏*/
	Game.prototype.init = function () {
		snake.init();
		if (g.setting.func)
			window.clearInterval(g.setting.func);
		var d = document.getElementById("start"); 
		if (d)
			d.disabled = false;
		for (var x = 0; x < g.setting.size; x ++)
			for (var y = 0; y < g.setting.size; y ++)
				g.attr(x, y, "class", " ");
	}
	/*游戏开始*/
	Game.prototype.start = function () {
		g.setting.direct = g.direction.down;
		food.create();
		snake.create();
		//蛇移动
		g.setting.func = window.setInterval(function() {
			snake.move();
		}, g.setting.speed);
	}
	/*监听键盘*/
	Game.prototype.listen = function (e) {
		e = e || event;
		g.setting.direct = Math.abs(e.keyCode - g.setting.direct) != 2 && e.keyCode > 36 && e.keyCode < 41 ? e.keyCode : g.setting.direct;
	}
	/*游戏结束*/
	Game.prototype.over = function () {
		alert("game over XD!");
		game.init();
	};
	
	/*Snake构造器*/
	function Snake () {
		this.headX = 0;
		this.headY = 0;
		this.lastX = 0;
		this.lastY = 0;
		this.pos = [];
	};
	Snake.prototype.init = function () {
		this.headX = this.headY = this.lastX = this.lastY = 0;
		this.pos = [];
	}
	/*创建蛇*/
	Snake.prototype.create = function () {
		var x = g.create(g.setting.len, g.setting.size / 2),
		y = g.create(g.setting.len, g.setting.size / 2);
		//获得蛇的坐标
		for (var i = 0; i < g.setting.len; i ++) {
			y --;
			this.pos.push([x, y]);
			if (i == 0)
				g.attr(x, y, "class", "snake head");
			else
				g.attr(x, y, "class", "snake")
		}
	};
	/*移动*/
	Snake.prototype.move = function () {
			this.headX = this.pos[0][0];
			this.headY = this.pos[0][1];
			this.lastX = this.pos[this.pos.length - 1][0];
			this.lastY = this.pos[this.pos.length - 1][1];
			g.attr(this.lastX, this.lastY, "class", " ");
			for (var i = this.pos.length - 1; i > 0; i --) {
				this.pos[i][0] = this.pos[i - 1][0];
				this.pos[i][1] = this.pos[i - 1][1];
			}
			switch (g.setting.direct) {
				case g.direction.up : this.headY    -= 1; break;
				case g.direction.down : this.headY  += 1; break;
				case g.direction.left : this.headX  -= 1; break;
				case g.direction.right : this.headX += 1; break;
			}
			this.pos[0][0] = this.headX;
			this.pos[0][1] = this.headY;
			for (var i = 0; i < this.pos.length; i ++)
				g.attr(this.pos[i][0], this.pos[i][1], "class", "snake");
			g.attr(this.headX, this.headY, "class", "snake head")
			var inside = g.attr(this.headX, this.headY, "inside");
			if (inside == "food") {
				this.lastX = this.pos[this.pos.length - 1][0];
				this.lastY = this.pos[this.pos.length - 1][1];
				if (this.lastX == this.pos[this.pos.length - 2][0]) {
					if (this.lastY - this.pos[this.pos.length - 2][1] == 1)
						this.pos.push([this.lastX, this.lastY + 1]);
					else if (this.pos[this.pos.length - 2][1] - this.lastY == 1)
						this.pos.push([this.lastX, this.lastY - 1]);
				}
				else if (this.lastY == this.pos[this.pos.length - 2][1]) {
					if (this.lastX - this.pos[this.pos.length - 2][0] == 1)
						this.pos.push([this.lastX + 1, this.lastY])
					else if (this.pos[this.pos.length - 2][0] - this.lastX == 1)
						this.pos.push([this.lastX - 1, this.lastY]);
				}
				this.lastX = this.pos[this.pos.length - 1][0];
				this.lastY = this.pos[this.pos.length - 1][1];
				g.attr(this.lastX, this.lastY, "class", "snake");
				food.create();
				g.attr(this.headX, this.headY, "inside", " ");
			};
			//撞到自己或者墙，游戏结束
			for (var i = 1; i < this.pos.length; i ++) {
				if (this.headX == this.pos[i][0] && this.headY == this.pos[i][1])
					game.over();
				else
					continue;
			}
			if (this.headX > 19 || this.headX < 0 || this.headY > 19 || this.headY < 0)
				game.over();
		};
	
	/*Food构造器*/
	function Food () {
	};
		/*创建食物*/
	Food.prototype.create = function () {
		var that = this;
		var x = g.create(0, g.setting.size),
		y = g.create(0, g.setting.size);
		//检查是否与蛇的位置重合
		var c = g.attr(x, y, "class");
		if (c == "snake")
			return that.create();
		else {
			g.attr(x, y, "class", "food");
			g.attr(x, y, "inside", "food");
		}
	};

	var game = new Game(), food = new Food(), snake = new Snake();
	game.pannel();
	game.init();
	document.getElementById("start").onclick = function () {
		this.disabled = true;
		game.start();
		window.onkeydown = game.listen;
	}

})()