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
		/*创建格子*/
		this.pannel = function () {
			var t = [];
			t.push("<table>");
			for (var i = 0; i < g.setting.size; i ++) {
				t.push("<tr class = 'row' y = " + i + ">");
				for (var j = 0; j < g.setting.size; j ++) {
					t.push("<td id = 'box_" + j + "_" + i + "'></td>");
				}
				t.push("</tr>");
			}
			t.push("</table>");
			document.getElementById("pannel").innerHTML = t.join("");
		};
		/*初始化游戏*/
		this.init = function () {
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
		this.start = function () {
			g.setting.direct = g.direction.down;
			var snake = new Snake(), food = new Food();
			food.create();
			snake.create();
			//蛇移动
			g.setting.func = window.setInterval(snake.move, g.setting.speed);
		}
		/*监听键盘*/
		this.listen = function (e) {
			e = e || event;
			g.setting.direct = Math.abs(e.keyCode - g.setting.direct) != 2 && e.keyCode > 36 && e.keyCode < 41 ? e.keyCode : g.setting.direct;
		}
		/*游戏结束*/
		this.over = function () {
			alert("game over XD!");
			game.init();
		};
	};
	/*Snake构造器*/
	function Snake () {
		var headX, headY, pos = [];
		/*创建蛇*/
		this.create = function () {
			var x = g.create(g.setting.len, g.setting.size / 2),
			y = g.create(g.setting.len, g.setting.size / 2);
			//获得蛇的坐标
			for (var i = 0; i < g.setting.len; i ++) {
				y --;
				pos.push([x, y]);
				g.attr(x, y, "class", "snake");
			}
			g.attr(pos[0][0], pos[0][1], "class", "snake head");
		};
		/*移动*/
		this.move = function () {
			headX = pos[0][0];
			headY = pos[0][1];
			lastX = pos[pos.length - 1][0];
			lastY = pos[pos.length - 1][1];
			g.attr(lastX, lastY, "class", " ");
			for (var i = pos.length - 1; i > 0; i --) {
				pos[i][0] = pos[i - 1][0];
				pos[i][1] = pos[i - 1][1];
			}
			switch (g.setting.direct) {
				case g.direction.up : headY    -= 1; break;
				case g.direction.down : headY  += 1; break;
				case g.direction.left : headX  -= 1; break;
				case g.direction.right : headX += 1; break;
			}
			pos[0][0] = headX;
			pos[0][1] = headY;
			for (var i = 0; i < pos.length; i ++)
				g.attr(pos[i][0], pos[i][1], "class", "snake");
			g.attr(headX, headY, "class", "snake head")
			var inside = g.attr(headX, headY, "inside");
			if (inside == "food") {
				lastX = pos[pos.length - 1][0];
				lastY = pos[pos.length - 1][1];
				if (lastX == pos[pos.length - 2][0]) {
					if (lastY - pos[pos.length - 2][1] == 1)
						pos.push([lastX, lastY + 1]);
					else if (pos[pos.length - 2][1] - lastY == 1)
						pos.push([lastX, lastY - 1]);
				}
				else if (lastY == pos[pos.length - 2][1]) {
					if (lastX - pos[pos.length - 2][0] == 1)
						pos.push([lastX + 1, lastY])
					else if (pos[pos.length - 2][0] - lastX == 1)
						pos.push([lastX - 1, lastY]);
				}
				lastX = pos[pos.length - 1][0];
				lastY = pos[pos.length - 1][1];
				g.attr(lastX, lastY, "class", "snake");
				var food = new Food();
				food.create();
			};
			console.log(pos);
			//撞到自己或者墙，游戏结束
			for (var i = 1; i < pos.length; i ++) {
				if (headX == pos[i][0] && headY == pos[i][1])
					game.over();
				else
					continue;
			}
			if (headX > 19 || headX < 0 || headY > 19 || headY < 0)
				game.over();
		};
	};
	/*Food构造器*/
	function Food () {
		var that = this;
		/*创建食物*/
		this.create = function () {
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
	};

	var game = new Game();
	game.pannel();
	game.init();
	document.getElementById("start").onclick = function () {
		this.disabled = true;
		game.start();
		window.onkeydown = game.listen;
	}

})()