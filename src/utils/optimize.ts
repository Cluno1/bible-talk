/*
 * @Date: 2025-10-01 14:11:08
 * @LastEditors: zld 17875477802@163.com
 * @LastEditTime: 2025-10-01 14:20:33
 * @FilePath: \bible-talk\src\utils\optimize.ts
 */
//节流 固定间隔内最多执行一次
export function throttleHook(callback: Function, limitTime: number) {

    let canRun = true;
  
    return function (...params:any[]) {
      if (canRun) {
        canRun = false
        setTimeout(() => {
          canRun = true
        }, limitTime);
  
        callback(...params)
      }
    }
  }