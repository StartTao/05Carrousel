# 05Carrousel
1. Carousel.init($(".J_Poster"))
   初始化幻灯片切换中所有的 J_Poster 类

    在carousel.js中，如果有两个或两个以上的旋转木马，可以一次性new出所选的 J_Poster类 不必每次都通过
     var carousel = new Carousel($('.J_Poster').eq(0));  选择元素。

       Carousel.init = function(posters){
       var _this_=this;
       posters.each(function(){
           new _this_($(this));
         })
      }

2. 在类名为.J_Poster 的div中设置 data-setting 属性，控制初始化时的样式（如大小，位置等）
