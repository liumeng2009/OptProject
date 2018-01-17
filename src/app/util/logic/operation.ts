export class OperationUtil {
  setStatus(data,time){
    for(let d of data) {
      if (d.actions && d.actions.length > 0) {
        if (d.complete) {

        }
        else {
          d.complete = '3'
        }
        for (let i = 0; i < d.actions.length; i++) {
          if (d.actions[i].start_time) {
            d.complete = '1';
          }
          if (d.actions[i].operationComplete.toString() == '1'&&d.actions[i].end_time<=time) {
            d.complete = '2';
            break;
          }
        }
      }
      else {
        d.complete = '0'
      }
    }
    return data;
  }
}

