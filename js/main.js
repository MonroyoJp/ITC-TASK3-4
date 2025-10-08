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

function refreshOffsets() {
    taskOffsets = getTaskOffsets();
}

window.addEventListener("load", refreshOffsets);
let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        refreshOffsets();
        console.log("Offsets updated after resize");
    }, 400); 
});


document.querySelectorAll(".accordion-header").forEach(button => {
    button.addEventListener("click", () => {
        setTimeout(refreshOffsets, 600);
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

let isProcessing = false; 

if (wasdKeys.length) {
  window.addEventListener("keydown", (e) => {
    if (isProcessing) return; 
    const key = e.key.toLowerCase();
    const match = [...wasdKeys].find((k) => k.dataset.key === key);
    if (!match) return;

    match.classList.add("active");

    isProcessing = true;

    const stages = [
      { name: "Intake", color: "#00FF7F" },      
      { name: "Processing", color: "#FFD700" },  
      { name: "Output", color: "#1E90FF" },      
      { name: "Display", color: "#FF4040" }     
    ];

    let index = 0;

    const runStage = () => {
      if (index < stages.length) {
        const { name, color } = stages[index];
        processText.textContent = `Process: ${name}`;
        processText.style.color = color;
        processText.classList.add("active");

        setTimeout(() => {
          processText.classList.remove("active");
          index++;
          runStage();
          
        }, 700);
      } else {
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

document.getElementById("downloadPDF").addEventListener("click", async () => {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "1.5rem",
    zIndex: 99999,
    backdropFilter: "blur(3px)",
    transition: "opacity 0.3s ease"
  });
  overlay.id = "pdfOverlay";
  overlay.textContent = "📸 Generating PDF… Please wait";
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  const accordions = document.querySelectorAll(".accordion-content");
  const accordionStates = new Map();
  accordions.forEach(acc => {
    accordionStates.set(acc, {
      wasShown: acc.classList.contains("show"),
      maxHeight: acc.style.maxHeight,
      opacity: acc.style.opacity
    });
    acc.classList.add("show");
    acc.style.maxHeight = "none";
    acc.style.opacity = "1";
  });

  const fixedEls = document.querySelectorAll(".topNav-flex, .carousel, #downloadPDF");
  const originalDisplays = new Map();
  fixedEls.forEach(el => {
    originalDisplays.set(el, el.style.display);
    el.style.display = "none";
  });

  const wrapper = document.querySelector(".mainWrapper") || document.getElementById("mainWrapper");
  if (!wrapper) {
    alert("Main wrapper not found! Please check selector in main.js.");
    overlay.remove();
    document.body.style.overflow = "";
    return;
  }

  try {
    overlay.textContent = "Capturing content…";

    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      ignoreElements: el => el.id === "pdfOverlay"
    });

    overlay.textContent = "Compiling PDF…";

    const pdf = new jspdf.jsPDF("p", "px", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("ITC_TASK_3_TASK_4_ANSWERS.pdf");
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Something went wrong while generating the PDF.");
  } finally {
    accordions.forEach(acc => {
      const state = accordionStates.get(acc);
      if (state) {
        if (!state.wasShown) acc.classList.remove("show");
        acc.style.maxHeight = state.maxHeight;
        acc.style.opacity = state.opacity;
      }
    });

    fixedEls.forEach(el => {
      el.style.display = originalDisplays.get(el) || "";
    });

    overlay.remove();
    document.body.style.overflow = "";
  }
});

