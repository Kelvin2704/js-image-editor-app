const fileInput = document.querySelector(".file-input");

const filterOptions = document.querySelectorAll(".filter button");
const rotateOptions = document.querySelectorAll(".rotate button");
const filterName = document.querySelector(".name");
const filterValue = document.querySelector(".value");
const filterSlider = document.querySelector(".slider input");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const loadImage = () => {
  let file = fileInput.files[0]; // lấy file được chọn
  if (!file) return; // nếu user kh chọn thì return
  previewImg.src = URL.createObjectURL(file); // truyền url của file vào src của previewImg
  previewImg.addEventListener("load", () => {
    document.querySelector(".container").classList.remove("disable");
  });
};
filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    //thêm lắng nghe sự kiện click cho tất cả các buttons của filter
    document.querySelector(".filter .active").classList.remove("active"); // dom tới button có gắn class active và remove nó
    option.classList.add("active"); //thêm class active vào option được chọn
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");
  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetFilter = () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilter();
};

const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d"); //trả về một drawing context trên canvas;
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click()
};

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
chooseImgBtn.addEventListener("click", () => fileInput.click());
saveImgBtn.addEventListener("click", saveImage);
