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
		addHandler: function (ele, type, handler) {
			if (ele.length === undefined) {
				if (ele.addEventListener) {
					ele.addEventListener(type, handler, false);
				}
				else if (ele.attachEvent) {
					ele.attachEvent("on" + type, handler);
				}
				else {
					ele['on' + type] = handler;
				}
			}
			else if (ele.length === 0) {
				console.log("The element is null!");
				return false;
			}
			else {
				for (var i = 0; i < ele.length; i ++) {
					if (ele[i].addEventListener) {
						ele[i].addEventListener(type, handler, false);
					}
					else if (ele[i].attachEvent) {
						ele[i].attachEvent("on" + type, handler);
					}
					else {
						ele[i]['on' + type] = handler;
					}
				}
			}
		},
		removeHandler: function(element, type, handler) {
			if (ele.length === undefined) {
				if (ele.removeEventListener)
					ele.removeEventListener(type, handler, false);
				else if (ele.detachEvent)
					ele.detachEvent("on" + type, handler);
				else
					ele['on' + type] = null;
			}
			else if (ele.length === 0) {
				return (console.log("the element is null"));
			}
			else {
				for (var i = 0; i < ele.length; i ++) {
					if (ele[i].removeEventListener)
					ele[i].removeEventListener(type, handler, false);
				else if (ele[i].detachEvent)
					ele[i].detachEvent("on" + type, handler);
				else
					ele[i]['on' + type] = null;
				}
			}
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
				t.push("<td id = 'box_" + j + "_" + i + "' inside = ' ' x = '" + j + "' y = '" + i + "'></td>");
			}
			t.push("</tr>");
		}
		t.push("</table>");
		document.getElementById("pannel").innerHTML = t.join("");
	};
	/*初始化游戏*/
	Game.prototype.init = function () {
		score = 0;
		document.getElementById("score").innerHTML = score;
		snake.init();
		speed.disabled = start.disabled = false;
		if (g.setting.func)
			window.clearInterval(g.setting.func);
		for (var x = 0; x < g.setting.size; x ++)
			for (var y = 0; y < g.setting.size; y ++)
				g.attr(x, y, "class", " ");
	}
	/*游戏开始*/
	Game.prototype.start = function () {
		food.create();
		snake.create();
		g.setting.direct = g.direction.down;
		g.setting.func = window.setInterval(function() {
			snake.move();
			snake.AIMode();
		}, g.setting.speed)
		//蛇移动
		//g.setting.func = window.setInterval(function() {
		//	snake.move();
		//}, g.setting.speed);
	}
	/*监听键盘*/
	Game.prototype.listen = function (e) {
		e = e || event;
		command.push(Math.abs(e.keyCode - g.setting.direct) != 2 && e.keyCode > 36 && e.keyCode < 41 ? e.keyCode : g.setting.direct);
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
		this.f = 0;
		this.h = 0;
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
			if (i === 0) {
				g.attr(x, y, "class", "snake head");
			}
			else if (i === g.setting.len - 1){
				g.attr(x, y, "class", "snake tail")
			}
			else {
				g.attr(x, y, "class", "snake");
			}
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
		if (command.length == 0)
			command.push(g.setting.direct);
		g.setting.direct = command.shift();
		command = [];
		switch (g.setting.direct) {
			case g.direction.up : this.headY    -= 1; break;
			case g.direction.down : this.headY  += 1; break;
			case g.direction.left : this.headX  -= 1; break;
			case g.direction.right : this.headX += 1; break;
		}
		this.pos[0][0] = this.headX;
		this.pos[0][1] = this.headY;
		this.lastX = this.pos[this.pos.length - 1][0];
		this.lastY = this.pos[this.pos.length - 1][1];
		for (var i = 0; i < this.pos.length; i ++)
			g.attr(this.pos[i][0], this.pos[i][1], "class", "snake");
		g.attr(this.headX, this.headY, "class", "snake head");
		g.attr(this.lastX, this.lastY, "class", "snake tail");
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
			g.attr(this.lastX, this.lastY, "class", "snake tail");
			food.create();
			score ++;
			document.getElementById("score").innerHTML = score;
			g.attr(this.headX, this.headY, "inside", " ");
		};
		//撞到自己或者墙，游戏结束
		for (var i = 1; i < this.pos.length; i ++) {
			if (this.headX == this.pos[i][0] && this.headY == this.pos[i][1])
				game.over();
			else
				continue;
		}
		if (this.headX > (g.setting.size - 1) || this.headX < 0 || this.headY > (g.setting.size - 1) || this.headY < 0)
			game.over();
	};
	Snake.prototype.AIMode = function() {
		var head = [this.headX, this.headY],
			tail = [this.lastX, this.lastY],
			foodPos = food.pos,
			tailPath = this.existPath(tail, foodPos);
		if (tailPath.length) {
			var headPath = this.existPath(head, foodPos);
			if (headPath.length) {
				this.path(head, foodPos);
			}
		}
		else {
			this.path(head, tail);
		}
	};
	/* 算法JS实现 */
	Snake.prototype.path = function(sta, end) {
		var startX = sta[0], startY = sta[1], distance = this.existPath(sta, end);
		if (distance.length > 1) {
			if (distance[1][0] - startX > 0) {
				g.setting.direct = g.direction.right;
			};
			if (distance[1][0] - startX < 0) {
				g.setting.direct = g.direction.left;
			};
			if (distance[1][1] - startY > 0) {
				g.setting.direct = g.direction.down;
			};
			if (distance[1][1] - startY < 0) {
				g.setting.direct = g.direction.up;
			};
		}
	}
	/* BFS算法实现寻找路径 */
	Snake.prototype.existPath = function(start, end) {
		var visited = [], que = [], parent = [];
		var sta = start;
		for (var i = 0; i < g.setting.size; i ++) {
			visited[i] = [];
			parent[i] = [];
			for (var j = 0; j < g.setting.size; j ++) {
				visited[i][j] = false;
				parent[i][j] = [-1, -1];
			}
		}
		var tempque = [];
		tempque.push(start);
		if (start) {
			if (!visited[start[0]])
				console.log(start);
			visited[start[0]][start[1]] = true;
		}
		while (tempque.length) {
			start = tempque.shift();
			var x = start[0], y = start[1];
			for (var i = -1; i <= 1; i ++) {
				if (i === 0) {
					continue;
				}
				else {
					if (x + i < g.setting.size
						&& x + i >= 0
						&& g.attr(x + i, y, "class")
						&& (g.attr(x + i, y, "class").indexOf("snake") == -1
							|| g.attr(x + i, y, "class").indexOf("tail") != -1)
						&& !visited[x + i][y]) {
						tempque.push([x + i, y]);
						visited[x + i][y] = true;
						parent[x + i][y] = [x, y];
						if (x + i === end[0] && y === end[1]) {
							var temp = end;
							while (temp && temp[0] != -1) {
								que.unshift(temp);
								temp = parent[temp[0]][temp[1]];
							}
						}
					}
					if (y + i < g.setting.size
						&& y + i >=0
						&& g.attr(x, y + i, "class")
						&& (g.attr(x, y + i, "class").indexOf("snake") == -1
							|| g.attr(x, y + i, "class").indexOf("tail") != -1)
						&& !visited[x][y + i]) {
						tempque.push([x, y + i]);
						visited[x][y + i] = true;
						parent[x][y + i] = [x, y];
						if (x === end[0] && y + i === end[1]) {
							var temp = end;
							while (temp && temp[0] != -1) {
								que.unshift(temp);
								temp = parent[temp[0]][temp[1]];
							}
						}
					}
				}
			}
		}
		return que;
	}
	
	/*Food构造器*/
	function Food () {
		this.pos = [];
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
		this.pos = [x, y];
	};


	var command = [], game = new Game(), food = new Food(), snake = new Snake(), speed = document.getElementById("gameSpeed"), start = document.getElementById("start"), score = 0;
	game.pannel();
	game.init();
	function gameStart() {
		this.disabled = true;
		g.setting.speed = speed.options[speed.selectedIndex].value;
		speed.disabled = true;
		game.start();
		//window.onkeydown = game.listen;
	};
	function switchChange() {
		var cla = this.firstChild.className.split(" ");
		for (var i = 0; i < cla.length; i ++) {
			if (cla[i] == "switch-animate") {
				cla.splice(i, 1);
				break;
			}
		}
		cla = cla.join(" ");
		this.firstChild.className = cla;
	}
	function switchAnimate() {
		var cla = this.firstChild.className.split(" ");
		for (var i = 0; i < cla.length; i ++) {
			if (cla[i] == "switch-off") {
				cla.splice(i, 1, "switch-on");
				break;
			}
			else if (cla[i] == "switch-on") {
				cla[i] = "switch-off";
				break;
			}
		}
		cla.push("switch-animate");
		cla = cla.join(" ");
		this.firstChild.className = cla;
	}
	g.addHandler(start, "click", gameStart);
	g.addHandler(document.getElementsByClassName("switch"), 'mousedown', switchChange);
	g.addHandler(document.getElementsByClassName("switch"), 'mouseup', switchAnimate);
})()