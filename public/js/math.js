$(document).ready(function() {
  (function() {
      var throttle = function(type, name, obj) {
          obj = obj || window;
          var running = false;
          var func = function() {
              if (running) { return; }
              running = true;
               requestAnimationFrame(function() {
                  obj.dispatchEvent(new CustomEvent(name));
                  running = false;
              });
          };
          obj.addEventListener(type, func);
      };

      /* init - you can init any event */
      throttle("resize", "optimizedResize");
  })();

  let ans1 = document.getElementById("ans1");
  let ans2 = document.getElementById("ans2");
  let header_cont = document.getElementById("header-cont");
  let eq = plot.getAttribute("data-eq");
  function draw() {
    let size = header_cont.offsetWidth;
    try {
      functionPlot({
         width: size * 0.98,
         height: size * .555,
        target: '#plot',
        data: [{
          fn: eq,
          sampler: 'builtIn',  // this will make function-plot use the evaluator of math.js
          graphType: 'polyline'
        }]
      });
    }
    catch (err) {
      console.log(err);
    }
  }
  katex.default.render(eq + "", ans1, {
   tip: {xLine:false}
  });
  draw();
  window.addEventListener("optimizedResize", function() {
      draw();
  });
});
