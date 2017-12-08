import {
  Surface, Path, Text, Group, GradientOptions,
  GradientStopOptions, GradientStop,LinearGradient,geometry as geo
} from '@progress/kendo-drawing';

import { transform,Point,Size,Rect,Transformation} from '@progress/kendo-drawing/geometry';
import {Coordinate} from "../../../bean/coordinate";


export function drawProcess(surface,data,_this) {

  let height=surface._size.height;
  let width=surface._size.width;

  let createTime=data.createTime;
  //组织一个list，里面存放id和这个id相关的四个坐标，点击时，根据点击点在哪个坐标区域内，来决定id是谁
  let coordinateArray:Coordinate[]=[];

  surface.bind('click',(e)=>{
    console.log(e);
    console.log(coordinateArray);
    let xClickInMap=e.originalEvent.offsetX;
    let yClickInMap=e.originalEvent.offsetY;
    for(let coord of coordinateArray){
      if(xClickInMap>=coord.lt&&xClickInMap<=coord.rt&&yClickInMap>=coord.lb&&yClickInMap<=coord.rb){
        //说明在区域中
        //alert(coord.id);
        //mission.showActionDialog.emit(coord.id);
        _this.test(coord.id);
        break;
      }
    }
  });

  let processs=data.process;
  //x轴的最小时间
  let xAxisMinTime=new Date(createTime.getFullYear(),createTime.getMonth(),createTime.getDate(),createTime.getHours(),0,0,0);
  //计算x轴的最大时间
  let xAxisMaxTime=new Date(1900,1,1,0,0,0,0);
  if(data.process.length>0) {
    for (let i = 0; i < data.process.length; i++) {
      if (data.process[i].operationFinish) {
        //说明这条进程标志着工单结束，那么最大时间就是这个进程的完成时间
        let finishTime = data.process[i].finishTime;
        xAxisMaxTime = new Date(finishTime.getFullYear(), finishTime.getMonth(), finishTime.getDate(), finishTime.getHours() + 1, 0, 0, 0);
        break;
      }
      else{
        //有完成时间
        if(data.process[i].finishTime){
          let finishTime=data.process[i].finishTime;
          if(Date.parse(finishTime)>Date.parse(xAxisMaxTime.toString())){
            xAxisMaxTime=new Date(finishTime.getFullYear(), finishTime.getMonth(), finishTime.getDate(), finishTime.getHours() + 1, 0, 0, 0)
          }
        }
        else {
          //没有工单完成的标志位，说明全部的进程都没有完成工单，再找arriveTime的最大值
          if (data.process[i].arriveTime) {
            let arriveTime = data.process[i].arriveTime;
            if (Date.parse(arriveTime) > Date.parse(xAxisMaxTime.toString()))
              xAxisMaxTime = new Date(arriveTime.getFullYear(), arriveTime.getMonth(), arriveTime.getDate(), arriveTime.getHours() + 1, 0, 0, 0)
          }
          else {
            //连arrivetime都没有，再看zptime
            let zptime = data.process[i].zpTime;
            if (zptime) {
              if (Date.parse(zptime) > Date.parse(xAxisMaxTime.toString())) {
                xAxisMaxTime = new Date(zptime.getFullYear(), zptime.getMonth(), zptime.getDate(), zptime.getHours() + 1, 0, 0, 0)
              }
            }
          }
        }
      }

    }
  }
  else{
    xAxisMaxTime=new Date(createTime.getFullYear(),createTime.getMonth(),createTime.getDate(),createTime.getHours()+2,0,0,0);
  }

  console.log(xAxisMinTime);
  console.log(xAxisMaxTime);

  //预定的可用刻度
  let timeSpanArray=[5,10,20,30,60,120,240,480];
  //计算x轴刻度应该是多少
  let timeSpan=Date.parse(xAxisMaxTime.toString())-Date.parse(xAxisMinTime.toString());
  //最多有多少刻度
  let MAX_SCALE_COUNT=20;
  //左边预留多少距离
  let LEFT_MARGIN=60;
  let is=0;
  while(timeSpan/(timeSpanArray[is]*1000*60)>MAX_SCALE_COUNT){
    is++;
  }
  //单位:分钟 最小刻度值
  let scale=timeSpanArray[is];

  let scaleCount=timeSpan/(scale*1000*60)+1;

  let scaleWidth=(width-LEFT_MARGIN)/scaleCount;

  console.log(scaleWidth);

  let groupLine=new Group();

  let dayFirst=xAxisMinTime.getDate();

  for(let i=0;i<scaleCount;i++){
    let path = new Path({
      stroke: {
        color: `rgba(0, 0, 0, 0.08)`,
        width: 1
      }
    });

    let timeNowStamp=Date.parse(xAxisMinTime.toString())+scale*60*1000*i;

    let timeNow=new Date(timeNowStamp)

    if(dayFirst==timeNow.getDate()){

    }
    else{
      let timeText=timeNow.getFullYear().toString().substring(2,4)+'/'+timeNow.getMonth() +'/'+timeNow.getDate();
      let textDate=new Text(timeText,[scaleWidth*i+LEFT_MARGIN-33, height-50+26],{});
      groupLine.append(textDate);
      dayFirst=timeNow.getDate();
    }

    path.moveTo(scaleWidth*i+LEFT_MARGIN, 50).lineTo(scaleWidth*i+LEFT_MARGIN, height-50+6);

    // Create the text

    if(i==0){
      let timeText=xAxisMinTime.getFullYear().toString().substring(2,4)+'/'+xAxisMinTime.getMonth() +'/'+xAxisMinTime.getDate();
      let textDate=new Text(timeText,[scaleWidth*i+LEFT_MARGIN-33, height-50+26],{});
      groupLine.append(textDate);
    }

    let text = new Text(showTime(xAxisMinTime,i,scale), [LEFT_MARGIN+scaleWidth*i-17, height-50+6], {

    });

    groupLine.append(path,text);

  }

  let pathRed=new Path({
    stroke:{
      color:'rgba(0, 0, 0, 0.08)',
      width:1
    }
  })

  pathRed.moveTo(LEFT_MARGIN-3,height-50).lineTo(width-LEFT_MARGIN+scaleWidth,height-50).close();

  groupLine.append(pathRed);

  let processLength=processs.length;

  //几个人就有几条分割线
  let personHeight=(height-50-50)/processLength;

  for(let i=0;i<processLength;i++){
    let path = new Path({
      stroke: {
        color: `rgba(0, 0, 0, 0.08)`,
        width: 1
      }
    });
    path.moveTo(LEFT_MARGIN-3,50+personHeight*i).lineTo(width-LEFT_MARGIN+scaleWidth,50+personHeight*i);

    let textWorker = new Text(processs[i].worker, [LEFT_MARGIN-3-50, 50+personHeight*i+(personHeight-16)/2], {

    });

    groupLine.append(path,textWorker);

  }

  //工单建立时间
  let createToYTime=Date.parse(createTime)-Date.parse(xAxisMinTime.toString());
  let createLineX=createToYTime/(scale*60*1000)*scaleWidth;
  let pathCreateLine = new Path({
    stroke: {
      color: `green`,
      width: 1,
      dashType:'dot'
    }
  });
  pathCreateLine.moveTo(LEFT_MARGIN+createLineX,15).lineTo(LEFT_MARGIN+createLineX,height-23);

  let textCreateLine = new Text('工单建立:'+showTimeSimple(new Date(createTime)), [LEFT_MARGIN+createLineX+5, 10], {

  });

  groupLine.append(pathCreateLine,textCreateLine);

  //绑定进程
  let groupBar=new Group();
  let PROCESS_BAR_WIDTH=30;
  let xMin=0;
  for(let i=0;i<processLength;i++){
    let _process=processs[i];
    let y=50+((personHeight-PROCESS_BAR_WIDTH)/2)+personHeight*i;
    if(_process.arriveTime){
      //说明指派矩形是完整的
      let x;
      let zpToYTime= Date.parse(_process.zpTime)-Date.parse(xAxisMinTime.toString());
      x=(zpToYTime/(scale*60*1000))*scaleWidth+LEFT_MARGIN;

      if(xMin==0){
        xMin=x;
      }
      else{
        if(x<xMin){
          xMin=x;
        }
      }

      let xArrive;
      let arriveToYTime= Date.parse(_process.arriveTime)-Date.parse(xAxisMinTime.toString());
      xArrive=(arriveToYTime/(scale*60*1000))*scaleWidth+LEFT_MARGIN;

      let textZp = new Text('指派:'+showTimeSimple(new Date(_process.zpTime)), [x+6, y-16-6], {

      });
      let textStartWork = new Text('开始工作:'+showTimeSimple(new Date(_process.arriveTime)), [xArrive+6, y+PROCESS_BAR_WIDTH+6], {

      });

      let rect = new Rect([x, y], [xArrive-x, PROCESS_BAR_WIDTH]);
      let path = Path.fromRect(rect, {
        stroke: {
          color: '#ffffff',
          width: 0
        },
        fill: { color: 'rgb(199,206,178)' },
        cursor: 'pointer'
      });

      let _coordinateZp=new Coordinate(_process.id,'zp',parseInt(x),parseInt(xArrive),parseInt(y.toString()),parseInt((y+PROCESS_BAR_WIDTH).toString()));
      coordinateArray.push(_coordinateZp);

      groupBar.append(path);
      groupLine.append(textZp,textStartWork);

      //再看完成时间是否设置了
      if(_process.finishTime){
        let finishToYTime=Date.parse(_process.finishTime)-Date.parse(xAxisMinTime.toString());
        let xFinish=(finishToYTime/(scale*60*1000))*scaleWidth+LEFT_MARGIN;
        let rectFinish = new Rect([xArrive, y], [xFinish-xArrive, PROCESS_BAR_WIDTH]);


        let pathFinish=Path.fromRect(rectFinish, {
          stroke: {
            color: '#ffffff',
            width: 0
          },
          fill:{color:'rgb(25,148,177)'},
          cursor: 'pointer'
        })

        let _coordinateFinish=new Coordinate(_process.id,'finish',xArrive,xFinish,y,y+PROCESS_BAR_WIDTH);
        coordinateArray.push(_coordinateFinish);


        let textEndWork = new Text('工作结束:'+showTimeSimple(new Date(_process.finishTime)), [xFinish+6, y+(PROCESS_BAR_WIDTH-16)/2], {

        });

        groupBar.append(pathFinish);
        groupLine.append(textEndWork);
      }
      else{
        //说明工作进行中，但是没有完成
        let rectUnFinish = new Rect([xArrive, y], [2*scaleWidth, PROCESS_BAR_WIDTH]);

        let l=new LinearGradient();
        l.addStop(0,'rgb(25,148,177)',1);
        l.addStop(1,'rgb(255,255,255)',1);

        let pathUnFinish=Path.fromRect(rectUnFinish, {
          stroke: {
            color: '#ffffff',
            width: 0
          },
          fill:l,
          cursor: 'pointer'
        });

        let _coordinateWorking=new Coordinate(_process.id,'working',xArrive,xArrive+2*scaleWidth,y,y+PROCESS_BAR_WIDTH);
        coordinateArray.push(_coordinateWorking);

        let textNoEndWork = new Text('工作未结束', [xArrive+2*scaleWidth, y+(PROCESS_BAR_WIDTH-16)/2], {

        });

        groupBar.append(pathUnFinish);
        groupLine.append(textNoEndWork);

      }

    }
    else{
      //还在指派中，还没去开始工作
      let xZp;
      let zpToYTime= Date.parse(_process.zpTime)-Date.parse(xAxisMinTime.toString());
      xZp=(zpToYTime/(scale*60*1000))*scaleWidth+LEFT_MARGIN;
      let rectUnWork = new Rect([xZp, y], [2*scaleWidth, PROCESS_BAR_WIDTH]);

      let l=new LinearGradient();
      l.addStop(0,'rgb(199,206,178)',1);
      l.addStop(1,'rgb(255,255,255)',1);

      let pathUnFinish=Path.fromRect(rectUnWork, {
        stroke: {
          color: '#ffffff',
          width: 0
        },
        fill:l,
        cursor: 'pointer'
      });

      let _coordinateZping=new Coordinate(_process.id,'worker',xZp,xZp+2*scaleWidth,y,y+PROCESS_BAR_WIDTH);
      coordinateArray.push(_coordinateZping);

      let textZp = new Text('指派:'+showTimeSimple(new Date(_process.zpTime)), [xZp+6, y-16-6], {

      });
      let textNoWork = new Text('工作未开始', [xZp+2*scaleWidth, y+(PROCESS_BAR_WIDTH-16)/2], {

      });

      groupBar.append(pathUnFinish);
      groupLine.append(textZp,textNoWork);
    }



  }

  //工单结束时间
  for(let i=0;i<processLength;i++){
    let _process=processs[i];
    if(_process.operationFinish){
      //这条信息有工单完成标志位
      let finishToYTime=Date.parse(_process.finishTime)-Date.parse(xAxisMinTime.toString());
      let finishLineX=finishToYTime/(scale*60*1000)*scaleWidth;
      let pathFinishLine = new Path({
        stroke: {
          color: `green`,
          width: 1,
          dashType:'dot'
        }
      });




      pathFinishLine.moveTo(LEFT_MARGIN+finishLineX,15).lineTo(LEFT_MARGIN+finishLineX,height-23);

      let textFinishLine = new Text('工单完成:'+showTimeSimple(new Date(_process.finishTime)), [LEFT_MARGIN+finishLineX+5, 10], {

      });

      groupLine.append(pathFinishLine,textFinishLine);

      break;

    }
  }



  surface.draw(groupLine);
  surface.draw(groupBar);
  //毫秒
  let animationTime=1000;
  let intervalTime=10;
  let than=0;
  let intervalNow=0;
  let than2=0-xMin;
  let than3=than2;


  let loop=setInterval(()=>{
    groupBar.transform(transform().translate(than2,0).scale(than,1));
    //than=than+intervalTime/animationTime;
    let newthan=easeInOut(intervalNow,0,1,animationTime);
    let newthan2=easeInOut(intervalNow,xMin,than3,animationTime);
    if(newthan<than){
      clearInterval(loop);
    }
    else{
      than=newthan;
      than2=newthan2;
    }
    intervalNow=intervalNow+intervalTime;
  },intervalTime)
}

export function showTime(startTime:Date,i,scale){
  let date=startTime;
  let dateStamp=Date.parse(date.toString());
  dateStamp=dateStamp+(scale*i)*60*1000;
  let dateNew=new Date(dateStamp);
  return (dateNew.getHours()<10?'0'+dateNew.getHours():dateNew.getHours())+':'+(dateNew.getMinutes()<10?'0'+dateNew.getMinutes():dateNew.getMinutes())+'';
}

export function showTimeSimple(time:Date){
  let dateNew=time;
  return (dateNew.getHours()<10?'0'+dateNew.getHours():dateNew.getHours())+':'+(dateNew.getMinutes()<10?'0'+dateNew.getMinutes():dateNew.getMinutes())+'';
}

export function easeInOut(t,b,c,d){
  if((t /=d/2)<1) return c/2*t*t+b;
  return -c/2*((--t)*(t-2)-1)+b;
}

