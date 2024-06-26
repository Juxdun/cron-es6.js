/**
 * cron-es6.js 定时器
 * ---
 * VERSION 0.1
 * ---
 * DON'T USE THIS -- IT'S NOT QUITE THERE YET! 不要使用，还没完全实现！
 * ---
 * @author James Padolsey（原作者）
 * @author Juxdun
 * ---
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 */
let CronJob = (() => {
  class CronTime {
    constructor(time) {
      this.source = time;

      this.map = ["second", "minute", "hour", "dayOfMonth", "month", "dayOfWeek"];
      this.constraints = [
        [0, 59],
        [0, 59],
        [0, 23],
        [1, 31],
        [0, 11],
        [1, 7],
      ];
      this.aliases = {
        jan: 1,
        feb: 2,
        mar: 3,
        apr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        aug: 8,
        sep: 9,
        oct: 10,
        nov: 11,
        dec: 12,
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
      };

      this.second = {};
      this.minute = {};
      this.hour = {};
      this.dayOfMonth = {};
      this.month = {};
      this.dayOfWeek = {};

      this._parse();
    }
    _parse() {
      var aliases = this.aliases,
        source = this.source.replace(/[a-z]/i, function (alias) {
          alias = alias.toLowerCase();

          if (alias in aliases) {
            return aliases[alias];
          }

          throw new Error("Unknown alias: " + alias);
        }),
        split = this.source.replace(/^\s\s*|\s\s*$/g, "").split(/\s+/),
        cur,
        len = 6;

      while (len--) {
        cur = split[len] || "*";
        this._parseField(cur, this.map[len], this.constraints[len]);
      }
    }
    _parseField(field, type, constraints) {
      var rangePattern = /(\d+?)(?:-(\d+?))?(?:\/(\d+?))?(?:,|$)/g,
        typeObj = this[type],
        diff,
        low = constraints[0],
        high = constraints[1];

      // * is a shortcut to [lower-upper] range
      field = field.replace(/\*/g, low + "-" + high);

      if (field.match(rangePattern)) {
        field.replace(rangePattern, function ($0, lower, upper, step) {
          step = step || 1;

          // Positive integer higher than constraints[0]
          lower = Math.max(low, ~~Math.abs(lower));

          // Positive integer lower than constraints[1]
          upper = upper ? Math.min(high, ~~Math.abs(upper)) : lower;

          diff = step + upper - lower;

          while ((diff -= step) > -1) {
            typeObj[diff + lower] = true;
          }
        });
      } else {
        throw new Error("Field (" + field + ") cannot be parsed");
      }
    }
  }

  class CronJob {
    constructor(cronTime, event) {
      if (!(this instanceof CronJob)) {
        return new CronJob(cronTime, event);
      }

      this.events = [event];
      this.cronTime = new CronTime(cronTime);
      this.now = {};
      this.initiated = false;

      // this.clock()  // new完自动运行取消。
    }

    addEvent(event) {
      this.events.push(event);
    }

    runEvents() {
      for (var i = -1, l = this.events.length; ++i < l; ) {
        if (typeof this.events[i] === "function") {
          this.events[i]();
        }
      }
    }

    clock() {
      var date = new Date(),
        now = this.now,
        self = this,
        cronTime = this.cronTime,
        i;

      if (!this.initiated) {
        // Make sure we start the clock precisely ON the 0th millisecond
        setTimeout(function () {
          self.initiated = true;
          self.clock();
        }, Math.ceil(+date / 60 / 60 / 1000) * 1000 * 60 * 60 - +date); // 小时级时钟
        // }, Math.ceil(+date / 1000) * 1000 - +date) // 秒级时钟
        return;
      }

      this.timer =
        this.timer ||
        setInterval(function () {
          self.clock();
          // console.log("运行时钟")
        }, 60 * 60 * 1000); // 小时级时钟，每小时运行一次
      // }, 1000) // 秒级时钟

      now.second = date.getSeconds();
      now.minute = date.getMinutes();
      now.hour = date.getHours();
      now.dayOfMonth = date.getDate();
      now.month = date.getMonth();
      now.dayOfWeek = date.getDay();

      for (i in now) {
        if (!(now[i] in cronTime[i])) {
          return;
        }
      }

      this.runEvents();
    }

    stop() {
      // 停止，清除定时器
      clearInterval(this.timer);
      this.timer = undefined;
    }

    start() {
      this.clock();
    }
  }

  return CronJob;
})();

export default CronJob;
