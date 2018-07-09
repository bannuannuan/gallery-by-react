'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.scss');

//only need imageURL  获取图片相关数据
var imageDatas = require('../data/imageData.json');

//利用自执行函数，将图片信息转化为图片URL路径信息
function generateImageURL(imageDataArr){
    for(let i = 0; i < imageDataArr.length; i++){
        var singleImageData = imageDataArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
}
imageDatas = generateImageURL(imageDatas);//在原来JSON的基础上增加了imageURL属性

/*
* 获取某个区间内的一个随机数
* @param1 区间下限
* @param2 区间上限
 */
function getRangeRandom(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/*
 * 获取0-30°之间一个任意正负值
 */
function get30DegRandom(){
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

var ImgFigure = React.createClass({
    /*
    * 注册图片点击事件
     */
    handleClick: function (e) {
        if (this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },
    render: function () {
        //对使用的图片进行绝对定位
        var styleObj = {};
        if (this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }
        if (this.props.arrange.rotate){
            //考虑到兼容性 自带一个厂商前缀的数组并遍历 同时绑定this，使得在函数内可以使用this调用属性
            ['-moz-', '-ms-', '-webkit', '-o-', ''].forEach(function (value) {
                styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }
        if (this.props.arrange.isCenter){
            styleObj['z-Index'] = 11;
        }

        var imgFigureClassName = 'img-figure';
        imgFigureClassName = imgFigureClassName + (this.props.arrange.isInverse ? ' is-inverse' : '');

        return (
          <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
              <img src={this.props.data.imageURL} alt={this.props.data.title} />
              <figcaption>
                  <h2 className="img-title">{this.props.data.title}</h2>
                  <div className='img-back' onClick={this.handleClick}><p>{this.props.data.desc}</p></div>
              </figcaption>
          </figure>
        );
    }
});

//GalleryByReactApp作为管理函数，管理整个舞台模块
var GalleryByReactApp = React.createClass({
    Constant: {  //常量
        centerPos: {  //居中图片的位置  使用json对象
            left: 0,
            top: 0
        },
        hozPosRange: {
            leftX: [0, 0],
            rightX: [0, 0],
            y: [0, 0]
        },
        verPosRange: {
            x: [0, 0],
            topY: [0, 0]
        }
    },

    /*
    * 翻转图片 闭包函数
    * @param index 输入当前被执行inverse操作的图片的索引值
    * @return {Function} 这是一个闭包函数，其内return一个真正代被执行的函数
     */
    inverse: function (index) {
        return function () {
            var imgArrangeArr = this.state.imgArrangeArr;

            imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;

            this.setState({
                imgArrangeArr: imgArrangeArr
            });
      }.bind(this);
    },

    /*
     * 重新布局所有图片
     * @params 指定居中的图片
     */
    rearrange: function (centerIndex) {
        var imgArrangeArr = this.state.imgArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hozPosRange = Constant.hozPosRange,
            verPosRange = Constant.verPosRange,
            hozPosRangeLeftX = hozPosRange.leftX,
            hozPosRangeRightX = hozPosRange.rightX,
            hozPosRangeY = hozPosRange.y,
            verPosRangeTopY = verPosRange.topY,
            verPozRangeX = verPosRange.x;

        var imgArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),   //取1或者不取
            topImgSpliceIndex = 0,
            imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1); //删除居中显示的图片

        //居中显示centerIndex的图片 居中图片不需要旋转
        imgArrangeCenterArr[0].pos = centerPos;
        imgArrangeCenterArr[0].rotate = 0;
        imgArrangeCenterArr[0].isCenter = true;

        //取出布局上侧的图片的状态信息
        topImgSpliceIndex = Math.floor(Math.random() * (imgArrangeArr.length - topImgNum));
        imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上册的图片
        imgArrangeTopArr.forEach(function (value, index) {
            imgArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(verPosRangeTopY[0], verPosRangeTopY[1]),
                    left: getRangeRandom(verPozRangeX[0], verPozRangeX[1])
                },
                rotate: get30DegRandom(),
                isInverse: false,
                isCenter: false
            };
        });

        //布局左右两边的图片
        for (let i = 0, j = imgArrangeArr.length / 2; i < imgArrangeArr.length; i++){
            let hPosRangeLORX = null;
            //前半部分布局在左边 右半部分布局在右边
            if (i < j){
                hPosRangeLORX = hozPosRangeLeftX;
            }else {
                hPosRangeLORX = hozPosRangeRightX;
            }

            imgArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hozPosRangeY[0], hozPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isInverse: false,
                isCenter: false
            };
        }
        //把图片删除的还原回去
        if (imgArrangeTopArr && imgArrangeTopArr[0]){
            imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
        }
        imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);
        this.setState({
            imgArrangeArr: imgArrangeArr
        });

    },
    /*
    * 利用rearrange函数，居中对应index的图片
    * @param index,需要被居中的图片对应的图片数组信息的index
    * @return {Function}
    */
    center: function (index) {
        return function () {
            this.rearrange(index);
        }.bind(this);
    },

    getInitialState: function () {
        return {
            imgArrangeArr: [
            /*{
                pos: {
                    left: '0',
                    top: '0'
                },
                rotate: 0,
                isInverse: false,   //图片正反面 false表示正面
                isCenter: false
                }*/
            ]
        };
    },

    //组件加载后为每张图片计算其位置范围  回调函数
    componentDidMount: function () {

        //拿到舞台大小
        var stageDom = React.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //拿到imageFigure的大小 每一个imageFigure大小一样，拿到第一个就好
        var imgFigureDom = React.findDOMNode(this.refs.imageFigure0),
            imgW = imgFigureDom.scrollWidth,
            imgH = imgFigureDom.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算各个分区的值
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };
        this.Constant.hozPosRange.leftX[0] = -halfImgW;
        this.Constant.hozPosRange.leftX[1] = halfStageW - halfImgW * 3;

        this.Constant.hozPosRange.rightX[0] = halfStageW + imgW;
        this.Constant.hozPosRange.rightX[1] = stageW - halfImgW;

        this.Constant.hozPosRange.y[0] = -halfImgH;
        this.Constant.hozPosRange.y[1] = stageH - halfImgH;

        this.Constant.verPosRange.topY[0] = -halfImgH;
        this.Constant.verPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.Constant.verPosRange.x[0] = halfStageW - imgW;
        this.Constant.verPosRange.x[1] = halfStageW;

        this.rearrange(0);
    },

  render: function() {
      var controllerUnits = [],
          imgFigures = [];
      for (let i = 0; i < imageDatas.length; i++){
          if (!this.state.imgArrangeArr[i]){
              this.state.imgArrangeArr[i] = {
                  pos: {
                      left: 0,
                      top: 0
                  },
                  rotate: 0,
                  isInverse: false,
                  isCenter: false
              };
          }
         imgFigures.push(<ImgFigure data={imageDatas[i]} ref={'imageFigure' + i} arrange={this.state.imgArrangeArr[i]} inverse={this.inverse(i)} center={this.center(i)} />);
      }
      return (
        <section className="stage" ref="stage">
            <section className="img-sec">
                {imgFigures}
            </section>
            <nav className='controller-nav'>
                {controllerUnits}
            </nav>
        </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
