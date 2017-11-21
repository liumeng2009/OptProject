import {
  Surface, Path, Text, Group, GradientOptions,
  GradientStopOptions, GradientStop,LinearGradient
} from '@progress/kendo-drawing';

import { transform,Point,Size,Rect} from '@progress/kendo-drawing/geometry';

export function drawProcess(surface,data) {

  let height=surface._size.height;
  let width=surface._size.width;

  let createTime=data.createTime;

  let processs=data.process;
  //x轴的最小时间
  let xAxisMinTime=new Date(createTime.getFullYear(),createTime.getMonth(),createTime.getDate(),createTime.getHours(),0,0,0);
  //计算x轴的最大时间
  let xAxisMaxTime=new Date(1900,1,1,0,0,0,0);
  for(let i=0;i<data.process.length;i++){
    if(data.process[i].operationFinish){
      //说明这条进程标志着工单结束，那么最大时间就是这个进程的完成时间
      let finishTime=data.process[0].finishTime;
      xAxisMaxTime=new Date(finishTime.getFullYear(),finishTime.getMonth(),finishTime.getDate(),finishTime.getHours()+1,0,0,0);
      break;
    }
    else{
      //没有工单完成的标志位，说明全部的进程都没有完成工单，再找arriveTime的最大值
      if(data.process[0].arriveTime){
        let arriveTime=data.process[0].arriveTime;
        if(Date.parse(arriveTime)>Date.parse(xAxisMaxTime.toDateString()))
          xAxisMaxTime=new Date(arriveTime.getFullYear(),arriveTime.getMonth(),arriveTime.getDate(),arriveTime.getHours()+1,0,0,0)
      }
      else{
        //连arrivetime都没有，再看zptime
        let zptime=data.process[0].zpTime;
        if(zptime){
          if(Date.parse(zptime)>Date.parse(xAxisMaxTime.toDateString())){
            xAxisMaxTime=new Date(zptime.getFullYear(),zptime.getMonth(),zptime.getDate(),zptime.getHours()+1,0,0,0)
          }
        }
      }
    }
  }

  console.log(xAxisMinTime);
  console.log(xAxisMaxTime);

  //预定的可用刻度
  let timeSpanArray=[5,10,20,30,60,120,240,480];
  //计算x轴刻度应该是多少
  let timeSpan=Date.parse(xAxisMaxTime.toString())-Date.parse(xAxisMinTime.toString());
  let MAX_SCALE_COUNT=20;
  let is=0;
  while(timeSpan/(timeSpanArray[is]*1000*60)>MAX_SCALE_COUNT){
    is++;
  }
  //单位:分钟 最小刻度值
  let scale=timeSpanArray[is];

  let scaleCount=timeSpan/(scale*1000*60)+1;

  let scaleWidth=width/scaleCount;

  const group=new Group();

  for(let i=0;i<scaleCount;i++){
    const path = new Path({
      stroke: {
        color: `rgba(0, 0, 0, 0.08)`,
        width: 1
      }
    });

    path.moveTo(scaleWidth*i+20, 50).lineTo(scaleWidth*i+20, height-50+6);

    // Create the text
    const text = new Text(showTime(xAxisMinTime,i,scale), [scaleWidth*i, height-50+6], {

    });

    group.append(path,text);

  }

  const pathRed=new Path({
    stroke:{
      color:'rgba(0, 0, 0, 0.08)',
      width:1
    }
  })

  pathRed.moveTo(20-3,height-50).lineTo(width,height-50).close();

  group.append(pathRed);

  let processLength=processs.length;

  //几个人就有几条分割线
  let personHeight=(height-50-50)/processLength;

  for(let i=0;i<processLength;i++){
    const path = new Path({
      stroke: {
        color: `rgba(0, 0, 0, 0.08)`,
        width: 1
      }
    });
    path.moveTo(20-3,50+personHeight*i).lineTo(width,50+personHeight*i);
    group.append(path);
  }

  //工单建立时间
  let createToYTime=Date.parse(createTime)-Date.parse(xAxisMinTime.toString());
  let createLineX=createToYTime/(scale*60*1000)*scaleWidth;
  const pathCreateLine = new Path({
    stroke: {
      color: `green`,
      width: 1
    }
  });
  pathCreateLine.moveTo(20+createLineX,0).lineTo(20+createLineX,height-0);

  const textCreateLine = new Text('工单建立:'+showTimeSimple(new Date(createTime)), [20+createLineX+5, 10], {

  });

  group.append(pathCreateLine,textCreateLine);

  //绑定进程
  let PROCESS_BAR_WIDTH=20;
  for(let i=0;i<processLength;i++){
    let _process=processs[i];
    if(_process.arriveTime){
      //说明指派矩形是完整的
      let y=50+((personHeight-PROCESS_BAR_WIDTH)/2)+personHeight*i;
      let x;
      let zpToYTime= Date.parse(_process.zpTime)-Date.parse(xAxisMinTime.toString());
      x=(zpToYTime/(scale*60*1000))*scaleWidth+20;

      let xArrive;
      let arriveToYTime= Date.parse(_process.arriveTime)-Date.parse(xAxisMinTime.toString());
      xArrive=(arriveToYTime/(scale*60*1000))*scaleWidth+20;

      const textZp = new Text('指派:'+showTimeSimple(new Date(_process.zpTime)), [x, y-20], {

      });
      const textStartWork = new Text('开始工作:'+showTimeSimple(new Date(_process.arriveTime)), [xArrive, y+20+6], {

      });

      const rect = new Rect([x, y], [xArrive-x, PROCESS_BAR_WIDTH]);
      const path = Path.fromRect(rect, {
        stroke: {
          color: '#ffffff',
          width: 1
        },
        fill: { color: '#ff0000' },
        cursor: 'pointer'
      });

      group.append(path,textZp,textStartWork);

      //再看完成时间是否设置了
      if(_process.finishTime){
        let finishToYTime=Date.parse(_process.finishTime)-Date.parse(xAxisMinTime.toString());
        let xFinish=(finishToYTime/(scale*60*1000))*scaleWidth+20;
        let rectFinish = new Rect([xArrive, y], [xFinish-xArrive, PROCESS_BAR_WIDTH]);



        let gstop=new  GradientStop({color:'red',offset:0,opacity:0.5});
        let gstop1=new  GradientStop({color:'green',offset:1,opacity:0.7});

        //let opt:GradientOptions={name:'123',stops:[{color:'red',offset:0,opacity:0.5},gstop1]}

        let l=new LinearGradient();
        l.addStop(0,'red',0.5);
        l.addStop(1,'green',0.5);

        const pathFinish=Path.fromRect(rectFinish, {
          stroke: {
            color: '#ffffff',
            width: 1
          },
          fill:l,
          cursor: 'pointer'
        });
        const textEndWork = new Text('工作结束:'+showTimeSimple(new Date(_process.finishTime)), [xFinish, y+20+6], {

        });

        group.append(pathFinish,textEndWork);

      }
      else{
        //说明工作进行中，但是没有完成

        let g:GradientStopOptions={color:'red',offset:10,opacity:1};
        let g1:GradientStopOptions={color:'green',offset:5,opacity:1};

        let gstop=new  GradientStop(g);
        let gstop1=new  GradientStop(g1);

        let linear=new LinearGradient({name:'litest',stops:[gstop,gstop1]});
        //group.append(linear);
        //linear.start([0,0]);

        //surface.draw(linear);
      }

    }
    else{
      //还在指派中，还没去开始工作
    }



  }



  surface.draw(group);
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

