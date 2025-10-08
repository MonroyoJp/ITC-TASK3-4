const top = 0;
const topNav = document.querySelector(".topNav-flex");
let currentYPos;
let topNavHeight = topNav.offsetHeight;
const fixedNavClass = "nav-fixed-bg";

const mainWrapper = document.querySelector(".mainWrapper");
const task6El = document.querySelector(".task6Holder");
const task7El = document.querySelector(".task7Holder");
const task8El = document.querySelector(".task8Holder");
const task9El = document.querySelector(".task9Holder");
const task10El = document.querySelector(".task10Holder");
const task11El = document.querySelector(".task11Holder");

const taskElArr = {
    task6: task6El,
    task7: task7El,
    task8: task8El,
    task9: task9El,
    task10: task10El,
    task11: task11El
}


const bullets = document.querySelectorAll(".bullet");
const activeBullet = document.querySelector(".bullet-active");
  
    window.addEventListener('load', ()=>{
        const y = bullets[0].offsetTop;
        activeBullet.style.setProperty("--bullet-active-transform", `${y}px`);

        
    });



function getTaskOffsets(){
    const offsets = {};
    for (const [key, el] of Object.entries(taskElArr)){
        if (el) {
            const style = window.getComputedStyle(el);
            const scrollMarginTop = parseInt(style.scrollMarginTop) || 0;
            offsets[key] = el.offsetTop - scrollMarginTop;
        }
    }
    return offsets;
}

let taskOffsets = getTaskOffsets();

// update offsets when window resizes or content changes
function refreshOffsets() {
    taskOffsets = getTaskOffsets();
}

// recalc on load, resize, and after a short delay when accordions toggle
window.addEventListener("load", refreshOffsets);
let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    // wait until the layout fully settles after resizing
    resizeTimer = setTimeout(() => {
        refreshOffsets();
        console.log("Offsets updated after resize");
    }, 400); // 400ms gives time for layout to restabilize
});


// whenever an accordion opens or closes, recalc offsets
document.querySelectorAll(".accordion-header").forEach(button => {
    button.addEventListener("click", () => {
        setTimeout(refreshOffsets, 600); // wait for animation to finish
    });
});


const taskKeys = Object.keys(taskOffsets);

window.addEventListener("scroll", () => {
    const topNavPos = topNav.getBoundingClientRect().top;
    const currentYPos = window.scrollY;

    currentYPos >= topNavPos + topNavHeight 
        ? topNav.classList.add(fixedNavClass)
        : topNav.classList.remove(fixedNavClass);

    for (const [key, offset] of Object.entries(taskOffsets)) {
        const nextKey = `task${parseInt(key.replace('task', '')) + 1}`;
        const nextOffset = taskOffsets[nextKey] || Infinity;

        if (currentYPos + topNavHeight >= offset && currentYPos + topNavHeight < nextOffset) {
            document.querySelectorAll('.nav-a').forEach(a => a.classList.remove("nav-active"));
            const keyIndex = taskKeys.indexOf(key);
            const bulY = bullets[keyIndex].offsetTop;
            activeBullet.style.setProperty("--bullet-active-transform", `${bulY}px`);
            document.querySelector(`[href="#${key}"]`)?.classList.add("nav-active");
        }
    }
});



document.querySelectorAll(".accordion-header").forEach(button => {
    button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    const caret = button.querySelector(".caret");


    if (content.style.maxHeight) {
        caret.style.color = "#5E5E5E";
        button.style.setProperty('--accordion-width-after', "100%");
        button.style.setProperty('--accordion-zIndex-after', "1");
        button.style.setProperty('--accordion-width-before', "0%");
        button.style.setProperty('--accordion-zIndex-before', "0");
        content.style.maxHeight = null;
        content.style.opacity = 0;
        caret.style.transform = "rotate(0deg)";
    } else {
        caret.style.color = "#C71111";
        button.style.setProperty('--accordion-width-after', "0%");
        button.style.setProperty('--accordion-zIndex-after', "0");
        button.style.setProperty('--accordion-width-before', "100%");
        button.style.setProperty('--accordion-zIndex-before', "1");
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = 1;
        caret.style.transform = "rotate(180deg)";
    }
    });

});

// ========== Simulated Computer Process for Key Press ==========
const wasdKeys = document.querySelectorAll("#wasdLayout .key");
const processText = document.getElementById("processText");

let isProcessing = false; // prevent multiple runs

if (wasdKeys.length) {
  window.addEventListener("keydown", (e) => {
    if (isProcessing) return; // block new presses if running
    const key = e.key.toLowerCase();
    const match = [...wasdKeys].find((k) => k.dataset.key === key);
    if (!match) return;

    // highlight key briefly
    match.classList.add("active");

    // prevent new presses
    isProcessing = true;

    // color-coded process stages
    const stages = [
      { name: "Intake", color: "#00FF7F" },      // green
      { name: "Processing", color: "#FFD700" },  // yellow
      { name: "Output", color: "#1E90FF" },      // blue
      { name: "Display", color: "#FF4040" }      // red
    ];

    let index = 0;

    const runStage = () => {
      if (index < stages.length) {
        const { name, color } = stages[index];
        processText.textContent = `Process: ${name}`;
        processText.style.color = color;
        processText.classList.add("active");

        // proceed to next stage after short delay
        setTimeout(() => {
          processText.classList.remove("active");
          index++;
          runStage();
          
        }, 700);
      } else {
        // reset at the end
        setTimeout(() => match.classList.remove("active"), 100);

        isProcessing = false;
        setTimeout(() => {
          processText.textContent = "Press any key (WSAD) to simulate computer process...";
          processText.style.color = "var(--text-description-grey)";
        }, 400);
      }
    };

    runStage();
  });
}

document.querySelectorAll(".color-toggle-global .dot").forEach((btn) => {
  btn.addEventListener("click", () => {
    const color = btn.getAttribute("data-color");
    const essayTexts = document.querySelectorAll(".essay-text");

    essayTexts.forEach((text) => {
      text.style.color = color === "white" ? "#fff" : "#000";
    });
  });
});

// ======= Auto-Length Screenshot -> PDF (safe finite loop) =======
document.getElementById("downloadPDF").addEventListener("click", async () => {
  // ===== Create overlay =====
  const overlay = document.createElement("div");
  overlay.id = "pdfOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.color = "#fff";
  overlay.style.fontSize = "1.5rem";
  overlay.style.zIndex = "99999";
  overlay.style.backdropFilter = "blur(3px)";
  overlay.textContent = "📸 Generating PDF… Please wait";
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  // ===== Expand accordions =====
  document.querySelectorAll(".accordion-content").forEach(c => {
    c.classList.add("show");
    c.style.maxHeight = "none";
    c.style.opacity = "1";
  });
  document.querySelectorAll(".caret").forEach(c => {
    c.style.transform = "rotate(180deg)";
    c.style.color = "#C71111";
  });

  // ===== Hide fixed elements =====
  const fixedEls = document.querySelectorAll(".topNav-flex, .carousel, #downloadPDF");
  fixedEls.forEach(el => (el.style.display = "none"));

  const images = [];

  // Lock total height at the start (so it doesn't keep growing)
  const totalHeight = document.body.scrollHeight;
  const viewportHeight = window.innerHeight;

  // Determine exactly how many full screens are needed
  const totalParts = Math.ceil(totalHeight / viewportHeight);

  try {
    for (let i = 0; i < totalParts; i++) {
      overlay.textContent = `Capturing part ${i + 1} of ${totalParts}...`;

      window.scrollTo(0, i * viewportHeight);
      await new Promise(r => setTimeout(r, 800)); // wait for render

      const canvas = await html2canvas(document.body, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: viewportHeight,
        ignoreElements: element => element.id === "pdfOverlay"
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      images.push(imgData);
    }

    // restore scroll & fixed elements
    window.scrollTo(0, 0);
    fixedEls.forEach(el => (el.style.display = ""));

    overlay.textContent = "Compiling PDF…";

    // ===== Build PDF =====
    const pdf = new jspdf.jsPDF("p", "px", "a4");
    const pageW = pdf.internal.pageSize.getWidth();

    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.src = images[i];
      await new Promise(r => (img.onload = r));

      const aspect = img.width / img.height;
      const pdfH = pageW / aspect;
      pdf.addImage(img, "JPEG", 0, 0, pageW, pdfH);
      if (i < images.length - 1) pdf.addPage();
    }

    pdf.save("FullPage_Screenshot.pdf");
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Something went wrong while generating the PDF.");
  } finally {
    overlay.remove();
    document.body.style.overflow = "";
  }
});

