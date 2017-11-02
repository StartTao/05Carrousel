;(function($){
    
    var Carousel = function(poster){
        //设置旋转时用到
        var self = this;
        //保存单个旋转木马对象
        this.poster = poster;
        //保存ul对象
        this.posterItemMain = poster.find("ul.poster-list");
        //保存前后切换按钮
        this.prevBtn = poster.find("div.poster-prev-btn");        
        this.nextBtn = poster.find("div.poster-next-btn");
        //保存幻灯片个数
        this.posterItems = poster.find("li.poster-item");

        //解决幻灯片偶数张，思路是吧第一张克隆一下，放到最后
        if(this.posterItems.size() % 2 ==0){
            this.posterItemMain.append(this.posterItems.eq(0).clone());
            this.posterItems = this.posterItemMain.children();
        }

        //保存第一帧
        this.posterFirstItem = this.posterItems.first();
        //最后一帧
        this.posterLastItem = this.posterItems.last();
        //解决点击过快出现的bug
        this.rotateFlag =true;

        //默认配置参数
        this.setting = {
                        "width":1000,  //幻灯片宽度
                        "height":270,   //幻灯片高度
                        "posterWidth":640,  //幻灯片第一帧宽度
                        "posterHeight":270,  //幻灯片第一帧高度
                        "scale":0.9,   //记录显示比例关系
                        "autoPlay":true,
                        "delay":2000,
                        "speed":500,
                        "verticalAlign":"middle"
                    }

        //默认配置参数扩展,有的话替换，没有的话添加
        $.extend(this.setting,this.getSetting())
        
        // console.log(this.setting)
        //设置配置参数值
        this.setSettingValue();
        //执行剩余帧的位置
        this.setPosterPos();

        //设置左旋转  （右按钮）
        this.nextBtn.click(function(){
            if(self.rotateFlag){
                self.rotateFlag =false;
                self.carouserRotate("left");
            }        
        });

        //设置右旋转  （左边按钮）
        this.prevBtn.click(function(){
            if(self.rotateFlag){
                self.rotateFlag =false;
                self.carouserRotate("right");
            }
        });

        //判断是否开启自动播放
        if(this.setting.autoPlay){
            this.autoPlay();
            this.poster.hover(function(){
                window.clearInterval(self.timer);  //若self为this,则this指向 this.poster
            },function(){
                self.autoPlay();
            })
        }
        
    };

    Carousel.prototype = {
        //自动播放函数
        
        autoPlay:function(){
            var self = this;
            this.timer =window.setInterval(function() {
                self.nextBtn.click();   
            },this.setting.delay);
        },

        //旋转函数
        carouserRotate:function(dir){
            var _this_=this;
            //设置一个存储zIndex的值得数组
            var zIndexArr = [];
            if(dir === 'left'){    //左旋转
               this.posterItems.each(function(){
                   var self =$(this),
                        //第一帧没有的话 拿最后一帧
                        prev =self.prev().get(0)?self.prev():_this_.posterLastItem,
                        width=prev.width(),
                        height=prev.height(),
                        zIndex= prev.css('zIndex'),
                        opacity =prev.css('opacity'),
                        left =prev.css('left'),
                        top= prev.css('top');

                       zIndexArr.push(zIndex);

                        self.animate({
                            width:width,
                            height:height,
                            // zIndex:zIndex,
                            opacity:opacity,
                            left:left,
                            top:top
                                },_this_.setting.speed,function(){
                                    _this_.rotateFlag=true;
                                });              
               });
              //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
              this.posterItems.each(function(i) {
                   $(this).css("zIndex",zIndexArr[i]);              
              });

            }else if(dir === 'right'){   //右旋转
                this.posterItems.each(function(){
                   var self =$(this),
                        next =self.next().get(0)?self.next():_this_.posterFirstItem,
                        width=next.width(),
                        height=next.height(),
                        zIndex= next.css('zIndex'),
                        opacity =next.css('opacity'),
                        left =next.css('left'),
                        top= next.css('top');
                        zIndexArr.push(zIndex);
                        self.animate({
                            width:width,
                            height:height,
                            // zIndex:zIndex,
                            opacity:opacity,
                            left:left,
                            top:top
                            },_this_.setting.speed,function(){
                                    _this_.rotateFlag=true;
                                });
                    
               });
               //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
                    this.posterItems.each(function(i) {
                        $(this).css("zIndex",zIndexArr[i]);              
                    });
            };
        },


        //设置剩余帧的位置关系
        setPosterPos:function(){
            var self= this;
            var sliceItems = this.posterItems.slice(1),
                sliceSize = sliceItems.size()/2,
                rightSlice = sliceItems.slice(0,sliceSize),
                leftSlice = sliceItems.slice(sliceSize),
                //定义层级关系变量
                level =Math.floor(this.posterItems.size()/2);
                // alert(leftSlice.size())
          
           //设置右边帧的位置关系和宽度高度top
            var rw =this.setting.posterWidth,
                rh =this.setting.posterHeight,
                //层级间隙
                gap = ((this.setting.width - this.setting.posterWidth)/2)/level;
            // alert(gap)

            //第一帧，未参与循环前
            var firstLeft =(this.setting.width - this.setting.posterWidth)/2;
            var fixOffsetLeft = firstLeft + rw;
            rightSlice.each(function(i){
              level--;
              rw=rw*self.setting.scale;
              rh=rh*self.setting.scale;
              var j=i;
            //   alert(rw)
              $(this).css({
                     zIndex:level,
                     width:rw,
                     height:rh,
                     opacity:1/(++j),
                     left:fixOffsetLeft + (++i)*gap -rw,
                    //  top:(self.setting.height-rh)/2    //固定式垂直对其方式
                    top:self.setVerticalAlign(rh)              //非固定式
              })
            })
              //设置左边的位置关系
              var lw = rightSlice.last().width(),
                  lh = rightSlice.last().height(),
                  oloop = Math.floor(this.posterItems.size()/2);
                //   alert(lw)
           leftSlice.each(function(i){

              $(this).css({
                     zIndex:i,
                     width:lw,
                     height:lh,
                     opacity:1/oloop,
                     left:i*gap,
                    //  top:(self.setting.height-lh)/2  //固定式
                    top:self.setVerticalAlign(lh)           //非固定式
                     });
            lw = lw/self.setting.scale;
            lh = lh/self.setting.scale;
            oloop--;
          });
        },

        //设置垂直排列对齐
        setVerticalAlign:function(height){
            var verticalType = this.setting.verticalAlign,
                top = 0;
            if(verticalType === "middle"){
                top = (this.setting.height - height)/2;
            }else if(verticalType === "top"){
                top =0;
            }else if(verticalType === "bottom"){
                top = this.setting.height - height;
            } else{
                //配置错误，返回居中的
                top = (this.setting.height - height)/2;
            }      
            return top;
        },
        

        //设置配置参数值取控制基本的宽度高度
       setSettingValue:function(){
            //整个幻灯片区域
            this.poster.css({
                            width:this.setting.width,
                            height:this.setting.height
                            });
            this.posterItemMain.css({
                            width:this.setting.width,
                            height:this.setting.height
                            });
            //计算前后切换按钮的宽度
            var w =(this.setting.width-this.setting.posterWidth)/2;
            // alert(this.posterItems.size()/2);
            this.nextBtn.css({
                            width:w,
                            height:this.setting.height,
                            zIndex:Math.ceil(this.posterItems.size()/2)
                            });
            this.prevBtn.css({
                            width:w,
                            height:this.setting.height,
                            zIndex:Math.ceil(this.posterItems.size()/2)                            
                            });
            //
            this.posterFirstItem.css({
                                width:this.setting.posterWidth,
                                height:this.setting.posterHeight,
                                left:w,
                                zIndex:Math.floor(this.posterItems.size()/2) 
                                    });
        },

        //获取人工配置参数
        getSetting:function(){
            var setting = this.poster.attr("data-setting");

            //转换为json对象
            if(setting && setting != " "){
                return $.parseJSON(setting);
            }else{
                return {};
            }
        }
    }

   Carousel.init = function(posters){
       var _this_=this;
       posters.each(function(){
           new _this_($(this));
       })
   }

    //  window['Carousel'] = Carousel;
     window.Carousel = Carousel;
})(jQuery)