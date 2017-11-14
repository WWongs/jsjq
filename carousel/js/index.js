(function($) {

var Carousel = function(poster) {
    var self = this;
    this.poster = poster;
    this.prevBtn = poster.find("div.posterPrevBtn");
    this.posterItemMain = poster.find("ul.posterList");
    this.nextBtn = poster.find("div.posterNextBtn");
    this.posterFirstItem = poster.find(".posterItem").first();
    this.posterLastItem = poster.find(".posterItem").last();
    this.itemLength = poster.find(".posterItem");
    this.rotateFlag = true;

    this.setting = {
        "width": 1000,
        "height": 270,
        "posterWidth": 640,
        "posterHeight": 270,
        "scale": 0.9,
        "speed": 500,
        "verticalAlign": "middle"
    }
    $.extend(this.setting, this.getSetting());

    this.setPosterValue(); //设置幻灯片效果的初始位置
    this.setPosterPos(); //设置幻灯片效果左右轮换的位置（left，top）

    this.prevBtn.click(function() { //左切换
        if (self.rotateFlag) {
            self.carouselRotate("right");
            self.rotateFlag = false;
        }
    });

    this.nextBtn.click(function() { //右切换
        if (self.rotateFlag) {
            self.carouselRotate("left");
            self.rotateFlag = false;
        }
    });

    if (this.setting.autoPlay) { //设置自动切换
        this.autoPlay();
    }

    this.poster.hover(function() { //鼠标移入区域取消、设置自动切换
        clearInterval(self.timer);
    }, function() {
        self.autoPlay();
    });
}

Carousel.prototype = {

    autoPlay: function() {
        var self = this;
        this.timer = setInterval(function() {
            self.nextBtn.click();
        }, this.setting.delay);
    },

    carouselRotate: function(dir) {

        var _this_ = this;
        var zIndexArr1 = [];
        var zIndexArr2 = [];

        if (dir === "left") {
            this.itemLength.each(function() {
                var self = $(this),
                    prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
                    width = prev.width(),
                    height = prev.height(),
                    zIndex = prev.css("zIndex"),
                    opacity = prev.css("opacity"),
                    left = prev.css("left"),
                    top = prev.css("top");
                zIndexArr1.push(zIndex);


                self.animate({
                    width: width,
                    height: height,
                    // zIndex: zIndex,
                    opacity: opacity,
                    left: left,
                    top: top
                }, _this_.setting.speed, function() {
                    _this_.rotateFlag = true;
                });
            });
            this.itemLength.each(function(i) {
                $(this).css("zIndex", zIndexArr1[i]);
            });
        } else if (dir === "right") {
            this.itemLength.each(function() {
                var self = $(this),
                    next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
                    width = next.width(),
                    height = next.height(),
                    zIndex = next.css("zIndex"),
                    opacity = next.css("opacity"),
                    left = next.css("left"),
                    top = next.css("top");
                zIndexArr2.push(zIndex);


                self.animate({
                    width: width,
                    height: height,
                    // zIndex: zIndex,
                    opacity: opacity,
                    left: left,
                    top: top
                }, _this_.setting.speed, function() {
                    _this_.rotateFlag = true;
                });
            });
            this.itemLength.each(function(i) {
                $(this).css("zIndex", zIndexArr2[i]);
            });
        }
    },

    getSetting: function() {

        var setting = this.poster.attr("data-setting");
        if (setting && setting != "") {
            return $.parseJSON(setting);
        } else {
            return {};
        }
        ;
    },

    setPosterValue: function() {
        this.poster.css({
            width: this.setting.width,
            height: this.setting.height
        });

        this.posterItemMain.css({
            width: this.setting.width,
            height: this.setting.height
        });

        var btnWidth = (this.setting.width - this.setting.posterWidth) / 2;
        var zIndex = (this.itemLength.length) / 2;

        this.prevBtn.css({
            width: btnWidth,
            height: this.setting.height,
            zIndex: Math.ceil(zIndex)
        });

        this.nextBtn.css({
            width: btnWidth,
            height: this.setting.height,
            zIndex: Math.ceil(zIndex)
        });

        this.posterFirstItem.css({
            left: btnWidth,
            zIndex: Math.floor(zIndex),
            width: this.setting.posterWidth,
            height: this.setting.posterHeight
        });
    },

    setPosterPos: function() {
        var self = this;
        var sliceItems = this.itemLength.slice(1),
            sliceSize = sliceItems.size() / 2,
            rightSlice = sliceItems.slice(0, sliceSize),
            level = Math.floor(this.itemLength.size() / 2),
            leftSlice = sliceItems.slice(sliceSize);

        //设置右边帧的位置关系和宽度高度top
        var rw = this.setting.posterWidth,
            rh = this.setting.posterHeight,
            gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;

        var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
        var fixOffsetLeft = firstLeft + rw;
        //设置左边位置关系
        rightSlice.each(function(i) {
            level--;
            rw = rw * self.setting.scale;
            rh = rh * self.setting.scale
            var j = i;
            $(this).css({
                zIndex: i,
                width: rw,
                height: rh,
                opacity: 1 / (++j),
                left: fixOffsetLeft + (++i) * gap - rw,
                top: self.setVertucalAlign(rh)
            });
        });
        //设置左边的位置关系
        var lw = rightSlice.last().width(),
            lh = rightSlice.last().height(),
            oloop = Math.floor(this.itemLength.size() / 2);
        leftSlice.each(function(i) {
            $(this).css({
                zIndex: i,
                width: lw,
                height: lh,
                opacity: 1 / oloop,
                left: i * gap,
                top: self.setVertucalAlign(lh)
            });
            lw = lw / self.setting.scale;
            lh = lh / self.setting.scale;
            oloop--;
        });
    },

    setVertucalAlign: function(height) {
        var verticalType = this.setting.verticalAlign,
            top = 0;
        if (verticalType === "middle") {
            top = (this.setting.height - height) / 2;
        } else if (verticalType === "top") {
            top = 0;
        } else if (verticalType === "buttom") {
            top = this.setting.height - height;
        } else {
            top = (this.setting.height) / 2;
        }
        return top;
    }



};


Carousel.init = function(pointers) { //初始化所有div为“pointer”的区域效果
    var _this_ = this;
    pointers.each(function(index, el) {
        new _this_($(this));
    });

}
window.Carousel = Carousel;
})(jQuery);