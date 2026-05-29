// Danh sách tài khoản đăng nhập mẫu, mỗi tài khoản có quyền admin hoặc nhân viên.
const users = [
  {
    email: "adminxuanhuu@gmail.com",
    password: "@@@Huu2121996",
    name: "Admin Hữu",
    role: "admin"
  },
  {
    email: "inhu.vn@gmail.com",
    password: "Thn@442324",
    name: "Chị Như",
    role: "staff"
  },
  {
    email: "tho2@gmail.com",
    password: "@@@123456",
    name: "Thợ trộn 2",
    role: "staff"
  }
];

// Đọc dữ liệu từ localStorage, nếu dữ liệu lỗi hoặc chưa có thì dùng giá trị mặc định.
function readStorage(key, fallback) {
  try {
    // Chuyển dữ liệu JSON trong localStorage về dạng object/array JavaScript.
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    // Nếu JSON bị hỏng thì trả về fallback để app không bị đứng.
    return fallback;
  }
}

// Xử lý đăng nhập bằng email và mật khẩu.
function login() {
  // Lấy email người dùng nhập trong form đăng nhập.
  const email = document.getElementById("email").value;
  // Lấy mật khẩu người dùng nhập trong form đăng nhập.
  const password = document.getElementById("password").value;

  // Tìm user có email và password khớp với danh sách users.
  const user = users.find(function(item) {
    return item.email === email && item.password === password;
  });

  // Nếu không tìm thấy user thì báo lỗi và dừng đăng nhập.
  if (!user) {
    document.getElementById("loginError").innerText = "Sai email hoặc mật khẩu.";
    return;
  }

  // Lưu user đang đăng nhập vào trình duyệt để reload vẫn giữ phiên.
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Hiển thị màn hình app sau khi đăng nhập thành công.
  showApp();
}

// Đăng xuất user hiện tại.
function logout() {
  // Xóa thông tin user đang đăng nhập.
  localStorage.removeItem("currentUser");
  // Tải lại trang để quay về màn hình đăng nhập.
  location.reload();
}

// Hiển thị app nếu đã đăng nhập, đồng thời bật khu vực admin nếu user là admin.
function showApp() {
  // Lấy user đang đăng nhập từ localStorage.
  let user = readStorage("currentUser", null);

  // Nâng cấp dữ liệu user cũ chưa có role để không bị lỗi sau khi thêm phân quyền.
  if (user && !user.role) {
    // Tìm lại user đầy đủ theo email.
    const upgradedUser = users.find(function(item) {
      return item.email === user.email;
    });

    // Nếu tìm thấy thì lưu lại user đầy đủ có role.
    if (upgradedUser) {
      user = upgradedUser;
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      // Nếu user cũ không còn hợp lệ thì xóa phiên đăng nhập.
      user = null;
      localStorage.removeItem("currentUser");
    }
  }

  // Nếu đã đăng nhập thì ẩn login và hiện app.
  if (user) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    document.getElementById("currentUser").innerText = user.name;
    // Cập nhật ô tỷ lệ nước theo công thức đang được chọn.
    handleRecipeChange();

    // Admin mới được thấy khu vực quản trị và chỉnh công thức.
    if (user.role === "admin") {
      document.getElementById("adminSection").style.display = "block";
      // Nạp số mặc định/các số đã lưu của công thức mì vào form admin.
      loadNoodleSettingsForm();
      // Nạp số mặc định/các số đã lưu của công thức hoành thánh/sủi cảo.
      loadDumplingSettingsForm();
    }
  }
}

// Thêm tên công thức mới tạm thời vào localStorage.
function addRecipe() {
  // Lấy tên công thức admin nhập.
  const recipeName = document.getElementById("recipeName").value;

  // Lấy danh sách công thức đã thêm trước đó.
  const recipes = readStorage("recipes", []);

  // Thêm công thức mới với id theo thời gian hiện tại.
  recipes.push({
    id: Date.now(),
    name: recipeName
  });

  // Lưu lại danh sách công thức vào trình duyệt.
  localStorage.setItem("recipes", JSON.stringify(recipes));

  // Báo cho admin biết đã lưu.
  alert("Đã thêm công thức");
}

// Bộ số mặc định của công thức mì vắt.
const defaultNoodleSettings = {
  // Mẻ gốc dùng để nhân tỷ lệ.
  baseKg: 14,
  // Tổng bột khô cho mẻ 14kg.
  dryFlour: 10000,
  // Tỷ lệ nước so với bột khô.
  waterRatioPercent: 40.6,
  // Số trứng trên 1kg bột khô.
  eggPer1400: 0.6,
  // Nước tro trên 1kg bột khô, tính bằng gram.
  nuocTroPer1400: 92,
  // Nước màu trên 1kg bột khô, tính bằng gram.
  nuocMauPer1400: 9,
  // Lòng trắng khô tính theo thành phẩm.
  longTrangKhoPercent: 0.13,
  // Phụ gia số 2 tính theo bột khô.
  additive2Percent: 0.18,
  // Phụ gia số 3 tính theo bột khô.
  additive3Percent: 0.03,
  // Phụ gia số 5 tính theo bột khô.
  additive5Percent: 0.15,
  // Phụ gia số 6 tính theo thành phẩm.
  additive6Percent: 0.18,
  // Phụ gia số 12 tính theo bột khô.
  additive12Percent: 0.18,
  // Phụ gia số 10 tính theo thành phẩm.
  s1000aPercent: 0.24,
  // Phụ gia số 13 tính theo thành phẩm.
  lk07Percent: 0.24
};

// Bộ số mặc định của công thức hoành thánh / sủi cảo.
const defaultDumplingSettings = {
  // Mẻ gốc dùng để nhân tỷ lệ.
  baseKg: 14,
  // Bột khô chưa cộng gluten cho mẻ 14kg.
  dryFlour: 9954,
  // Tỷ lệ nước so với bột khô + gluten.
  waterRatioPercent: 49.2,
  // Gluten tính theo thành phẩm / 1.4 * phần trăm.
  glutenPercent: 0.46,
  // Số trứng trên 1.4kg thành phẩm.
  eggPer1400: 0.3,
  // Nước tro tính theo 1kg bột khô + gluten.
  nuocTroPerKgDry: 95,
  // Nước màu tính theo 1kg bột khô + gluten.
  nuocMauPerKgDry: 9,
  // Lòng trắng khô tính theo thành phẩm.
  longTrangKhoPercent: 0.25,
  // Phụ gia số 4 tính theo thành phẩm.
  additive4Percent: 0.05,
  // Phụ gia số 2 tính theo bột khô.
  additive2Percent: 0.2,
  // Phụ gia số 3 tính theo bột khô.
  additive3Percent: 0.2,
  // Phụ gia số 5 tính theo thành phẩm / 1.4.
  additive5Percent: 0.1,
  // Phụ gia số 6 tính theo thành phẩm.
  additive6Percent: 0.1
};

// Tên thật của các phụ gia/nguyên liệu theo mã số.
const noodleIngredientNames = {
  2: "Muối",
  3: "Trehalose",
  4: "VMC ERYBATE",
  5: "kansui",
  6: "Chất bảo quản",
  7: "Trứng",
  8: "Nước tro",
  9: "Nước màu",
  10: "S1000A",
  12: "K2co3",
  13: "Gusto Lk07"
};

// Kiểm tra user hiện tại có phải admin không.
function isAdminUser() {
  // Lấy user đang đăng nhập.
  const user = readStorage("currentUser", null);

  // Trả về true nếu user tồn tại và có role admin.
  return user && user.role === "admin";
}

// Trả về nhãn hiển thị cho phụ gia theo quyền user.
function getNoodleIngredientLabel(code) {
  // Các mã 7, 8, 9 được phép hiện tên cho cả thợ trộn.
  const publicIngredientCodes = [7, 8, 9];

  // Nếu là mã công khai thì hiển thị cả số và tên.
  if (publicIngredientCodes.includes(code)) {
    return `${code} - ${noodleIngredientNames[code]}`;
  }

  // Admin được thấy tên thật của tất cả phụ gia.
  if (isAdminUser()) {
    return `${code}. ${noodleIngredientNames[code]}`;
  }

  // Nhân viên chỉ thấy mã số để bảo mật công thức.
  return `${code}`;
}

// Lấy cấu hình công thức mì, ưu tiên số admin đã lưu.
function getNoodleSettings() {
  // Đọc cấu hình mì đã lưu trong trình duyệt.
  const savedSettings = readStorage("noodleSettings", {});
  // Tự gom dữ liệu cũ Uni/CKX/Ba Số Năm/Gluten thành bột khô nếu trình duyệt còn lưu bản cũ.
  const migratedDryFlour = (
    Number(savedSettings.uniMi || 0)
    + Number(savedSettings.ckx || 0)
    + Number(savedSettings.baSoNam || 0)
    + Number(savedSettings.gluten || 0)
  );
  // Tự chia đôi tỷ lệ 13 cũ nếu trình duyệt còn lưu bản tổng 10 + 13.
  const migratedSplitPercent = Number(savedSettings.lk07Percent || 0) / 2;

  // Trộn mặc định + số đã lưu + số migrate để luôn có cấu hình đầy đủ.
  return {
    ...defaultNoodleSettings,
    ...savedSettings,
    dryFlour: savedSettings.dryFlour || migratedDryFlour || defaultNoodleSettings.dryFlour,
    s1000aPercent: savedSettings.s1000aPercent || migratedSplitPercent || defaultNoodleSettings.s1000aPercent,
    lk07Percent: savedSettings.s1000aPercent
      ? savedSettings.lk07Percent
      : migratedSplitPercent || defaultNoodleSettings.lk07Percent
  };
}

// Lấy cấu hình công thức hoành thánh/sủi cảo, ưu tiên số admin đã lưu.
function getDumplingSettings() {
  // Đọc cấu hình hoành thánh/sủi cảo đã lưu trong trình duyệt.
  const savedSettings = readStorage("dumplingSettings", {});

  // Trộn mặc định với số admin đã lưu.
  return {
    ...defaultDumplingSettings,
    ...savedSettings
  };
}

// Gán giá trị vào một ô input theo id.
function setInputValue(id, value) {
  document.getElementById(id).value = value;
}

// Đọc số từ input, nếu không phải số thì dùng fallback.
function getInputNumber(id, fallback) {
  // Ép giá trị input thành Number.
  const value = Number(document.getElementById(id).value);

  // Nếu người dùng để trống hoặc nhập lỗi thì dùng giá trị cũ.
  if (Number.isNaN(value)) {
    return fallback;
  }

  // Trả về số hợp lệ.
  return value;
}

// Tính lượng gluten theo công thức gốc 14kg trong form admin hoành thánh/sủi cảo.
function getDumplingAdminGlutenAmount(glutenPercent) {
  const baseKg = defaultDumplingSettings.baseKg;

  return ((baseKg * 1000) / 1.4) * (glutenPercent / 100);
}

// Lưu lại tổng bột khô + gluten hiện tại trên form admin.
function rememberDumplingBaseTotal() {
  const dryFlourInput = document.getElementById("dumplingDryFlour");
  const dryFlour = Number(dryFlourInput.value) || 0;
  const glutenPercent = getInputNumber("dumplingGlutenPercent", defaultDumplingSettings.glutenPercent);
  const gluten = getDumplingAdminGlutenAmount(glutenPercent);

  dryFlourInput.dataset.baseTotal = dryFlour + gluten;
}

// Khi admin đổi gluten, bột khô tự giảm/tăng để tổng bột khô + gluten không đổi.
function updateDumplingDryFlourForGluten() {
  const dryFlourInput = document.getElementById("dumplingDryFlour");
  const glutenPercent = getInputNumber("dumplingGlutenPercent", defaultDumplingSettings.glutenPercent);
  const gluten = getDumplingAdminGlutenAmount(glutenPercent);
  const baseTotal = Number(dryFlourInput.dataset.baseTotal) || (Number(dryFlourInput.value || 0) + gluten);
  const adjustedDryFlour = Math.max(baseTotal - gluten, 0);

  dryFlourInput.value = Number(adjustedDryFlour.toFixed(2));
}

// Đưa cấu hình mì hiện tại vào các ô chỉnh trong admin.
function loadNoodleSettingsForm() {
  // Lấy cấu hình mì sau khi gộp mặc định + localStorage.
  const settings = getNoodleSettings();

  // Mỗi dòng dưới đây đổ một thông số công thức mì vào ô admin tương ứng.
  setInputValue("settingDryFlour", settings.dryFlour);
  setInputValue("settingWaterRatioPercent", settings.waterRatioPercent);
  setInputValue("settingEggPer1400", settings.eggPer1400);
  setInputValue("settingNuocTroPer1400", settings.nuocTroPer1400);
  setInputValue("settingNuocMauPer1400", settings.nuocMauPer1400);
  setInputValue("settingLongTrangKhoPercent", settings.longTrangKhoPercent);
  setInputValue("settingAdditive2Percent", settings.additive2Percent);
  setInputValue("settingAdditive3Percent", settings.additive3Percent);
  setInputValue("settingAdditive5Percent", settings.additive5Percent);
  setInputValue("settingAdditive6Percent", settings.additive6Percent);
  setInputValue("settingAdditive12Percent", settings.additive12Percent);
  setInputValue("settingS1000aPercent", settings.s1000aPercent);
  setInputValue("settingLk07Percent", settings.lk07Percent);
}

// Đưa cấu hình hoành thánh/sủi cảo hiện tại vào các ô chỉnh trong admin.
function loadDumplingSettingsForm() {
  // Lấy cấu hình hoành thánh/sủi cảo sau khi gộp mặc định + localStorage.
  const settings = getDumplingSettings();

  // Mỗi dòng dưới đây đổ một thông số công thức hoành thánh/sủi cảo vào ô admin tương ứng.
  setInputValue("dumplingDryFlour", settings.dryFlour);
  setInputValue("dumplingWaterRatioPercent", settings.waterRatioPercent);
  setInputValue("dumplingGlutenPercent", settings.glutenPercent);
  setInputValue("dumplingEggPer1400", settings.eggPer1400);
  setInputValue("dumplingNuocTroPerKgDry", settings.nuocTroPerKgDry);
  setInputValue("dumplingNuocMauPerKgDry", settings.nuocMauPerKgDry);
  setInputValue("dumplingLongTrangKhoPercent", settings.longTrangKhoPercent);
  setInputValue("dumplingAdditive4Percent", settings.additive4Percent);
  setInputValue("dumplingAdditive2Percent", settings.additive2Percent);
  setInputValue("dumplingAdditive3Percent", settings.additive3Percent);
  setInputValue("dumplingAdditive5Percent", settings.additive5Percent);
  setInputValue("dumplingAdditive6Percent", settings.additive6Percent);
  // Ghi nhớ tổng bột khô + gluten để khi admin tăng gluten thì bột khô tự giảm tương ứng.
  rememberDumplingBaseTotal();
}

// Cập nhật ô tỷ lệ nước ngoài màn hình tính theo công thức đang chọn.
function updateWaterRatioDisplay() {
  // Lấy mã công thức đang chọn trong dropdown.
  const selectedRecipe = document.getElementById("recipe").value;
  // Nếu chọn hoành thánh thì lấy tỷ lệ của hoành thánh, còn lại lấy tỷ lệ của mì.
  const settings = selectedRecipe === "hoanhthanh"
    ? getDumplingSettings()
    : getNoodleSettings();

  // Gán tỷ lệ nước vào ô readonly để nhân viên chỉ xem, không sửa.
  document.getElementById("waterRatio").value = `${settings.waterRatioPercent}%`;
}

// Đổi icon, màu nhận diện và tỷ lệ nước khi người dùng chọn công thức.
function handleRecipeChange() {
  // Cập nhật tỷ lệ nước theo công thức đang chọn.
  updateWaterRatioDisplay();
  // Lấy mã công thức đang chọn trong dropdown.
  const selectedRecipe = document.getElementById("recipe").value;
  // Lấy khung icon nhận diện công thức.
  const recipeBadge = document.getElementById("recipeBadge");
  // Lấy ô chữ trong icon tròn.
  const recipeIcon = recipeBadge.querySelector(".recipe-icon");
  // Lấy dòng mô tả cạnh icon.
  const recipeBadgeText = document.getElementById("recipeBadgeText");

  // Hoành thánh/sủi cảo dùng nền xanh để khác với mì.
  if (selectedRecipe === "hoanhthanh") {
    recipeBadge.className = "recipe-badge recipe-badge-dumpling";
    recipeIcon.innerText = "HT";
    recipeBadgeText.innerText = "Công thức hoành thánh / sủi cảo";
    return;
  }

  // Mì dùng nền vàng.
  recipeBadge.className = "recipe-badge recipe-badge-noodle";
  recipeIcon.innerText = "MÌ";
  recipeBadgeText.innerText = "Công thức mì vắt";
}

// Đổi màu nền khung kết quả theo loại công thức để tránh nhầm.
function setResultTheme(type) {
  // Lấy khung kết quả.
  const resultElement = document.getElementById("result");
  // Gắn class chung và class riêng theo loại công thức.
  resultElement.className = type === "dumpling"
    ? "result result-dumpling"
    : "result result-noodle";
}

// Lưu các số admin chỉnh cho công thức mì.
function saveNoodleSettings() {
  // Lấy cấu hình hiện tại để làm fallback nếu ô nào bị trống.
  const currentSettings = getNoodleSettings();

  // Gom tất cả giá trị trong form admin thành object cấu hình mì.
  const settings = {
    ...currentSettings,
    dryFlour: getInputNumber("settingDryFlour", currentSettings.dryFlour),
    waterRatioPercent: getInputNumber("settingWaterRatioPercent", currentSettings.waterRatioPercent),
    eggPer1400: getInputNumber("settingEggPer1400", currentSettings.eggPer1400),
    nuocTroPer1400: getInputNumber("settingNuocTroPer1400", currentSettings.nuocTroPer1400),
    nuocMauPer1400: getInputNumber("settingNuocMauPer1400", currentSettings.nuocMauPer1400),
    longTrangKhoPercent: getInputNumber("settingLongTrangKhoPercent", currentSettings.longTrangKhoPercent),
    additive2Percent: getInputNumber("settingAdditive2Percent", currentSettings.additive2Percent),
    additive3Percent: getInputNumber("settingAdditive3Percent", currentSettings.additive3Percent),
    additive5Percent: getInputNumber("settingAdditive5Percent", currentSettings.additive5Percent),
    additive6Percent: getInputNumber("settingAdditive6Percent", currentSettings.additive6Percent),
    additive12Percent: getInputNumber("settingAdditive12Percent", currentSettings.additive12Percent),
    s1000aPercent: getInputNumber("settingS1000aPercent", currentSettings.s1000aPercent),
    lk07Percent: getInputNumber("settingLk07Percent", currentSettings.lk07Percent)
  };

  // Lưu cấu hình mì vào trình duyệt.
  localStorage.setItem("noodleSettings", JSON.stringify(settings));
  // Cập nhật lại ô tỷ lệ nước ngoài màn hình tính.
  updateWaterRatioDisplay();

  // Báo cho admin biết đã lưu.
  alert("Đã lưu công thức mì gốc");
}

// Lưu các số admin chỉnh cho công thức hoành thánh/sủi cảo.
function saveDumplingSettings() {
  // Lấy cấu hình hiện tại để làm fallback nếu ô nào bị trống.
  const currentSettings = getDumplingSettings();

  // Gom tất cả giá trị trong form admin thành object cấu hình hoành thánh/sủi cảo.
  const settings = {
    ...currentSettings,
    dryFlour: getInputNumber("dumplingDryFlour", currentSettings.dryFlour),
    waterRatioPercent: getInputNumber("dumplingWaterRatioPercent", currentSettings.waterRatioPercent),
    glutenPercent: getInputNumber("dumplingGlutenPercent", currentSettings.glutenPercent),
    eggPer1400: getInputNumber("dumplingEggPer1400", currentSettings.eggPer1400),
    nuocTroPerKgDry: getInputNumber("dumplingNuocTroPerKgDry", currentSettings.nuocTroPerKgDry),
    nuocMauPerKgDry: getInputNumber("dumplingNuocMauPerKgDry", currentSettings.nuocMauPerKgDry),
    longTrangKhoPercent: getInputNumber("dumplingLongTrangKhoPercent", currentSettings.longTrangKhoPercent),
    additive4Percent: getInputNumber("dumplingAdditive4Percent", currentSettings.additive4Percent),
    additive2Percent: getInputNumber("dumplingAdditive2Percent", currentSettings.additive2Percent),
    additive3Percent: getInputNumber("dumplingAdditive3Percent", currentSettings.additive3Percent),
    additive5Percent: getInputNumber("dumplingAdditive5Percent", currentSettings.additive5Percent),
    additive6Percent: getInputNumber("dumplingAdditive6Percent", currentSettings.additive6Percent)
  };

  // Lưu cấu hình hoành thánh/sủi cảo vào trình duyệt.
  localStorage.setItem("dumplingSettings", JSON.stringify(settings));
  // Cập nhật lại ô tỷ lệ nước ngoài màn hình tính.
  updateWaterRatioDisplay();

  // Báo cho admin biết đã lưu.
  alert("Đã lưu công thức hoành thánh / sủi cảo");
}

// Danh sách công thức có thể chọn ở dropdown.
const recipes = {
  mi14: {
    name: "Mì vắt 14kg",
    type: "noodle"
  },

  hoanhthanh: {
    name: "Hoành thánh / Sủi cảo",
    type: "dumpling"
  }
};

// Lưu kết quả vừa tính gần nhất để nút lưu lịch sử dùng.
let currentResult = null;

// Định dạng số hiển thị theo đơn vị.
function formatNumber(value, unit) {
  // Gram thì làm tròn về số nguyên để dễ cân.
  if (unit === "g") {
    return value.toFixed(0);
  }

  // Nếu số đã nguyên thì không cần hiện .0.
  if (Number.isInteger(value)) {
    return value.toFixed(0);
  }

  // Các đơn vị như trứng có thể cần 1 số lẻ.
  return value.toFixed(1);
}

// Thêm một dòng kết quả vào HTML và đồng thời lưu vào object kết quả.
function addResultLine(result, name, value, unit, className = "") {
  // Lưu giá trị tính được vào currentResult để khi lưu lịch sử có đầy đủ chi tiết.
  result.ingredients[name] = value;

  const classAttribute = className ? ` class="${className}"` : "";

  // Trả về một dòng HTML dạng: Tên nguyên liệu: số lượng đơn vị.
  return `<p${classAttribute}>${name}: <b>${formatNumber(value, unit)} ${unit}</b></p>`;
}

// Tính công thức mì vắt theo khối lượng thành phẩm người dùng nhập.
function calculateNoodleRecipe(targetKg, containerWeight, bagWeight) {
  // Đổi khung kết quả sang nền vàng của mì.
  setResultTheme("noodle");
  // Lấy cấu hình mì hiện tại.
  const settings = getNoodleSettings();
  // Đổi kg thành phẩm sang gram.
  const targetG = targetKg * 1000;
  // Tỷ lệ nhân so với mẻ gốc 14kg.
  const ratio = targetKg / settings.baseKg;

  // Bột khô thật cần dùng.
  const dryFlour = settings.dryFlour * ratio;
  // Bột khô cộng khối lượng bao để thợ kiểm tra trên cân.
  const scaleDryFlour = dryFlour + bagWeight;
  // Tỷ lệ nước/bột khô của công thức mì.
  const waterRatio = settings.waterRatioPercent;
  // Tổng thể tích nước/phần lỏng, làm tròn theo chục gram giống bảng.
  const totalVolume = Math.round((dryFlour * (waterRatio / 100)) / 10) * 10;
  // Tổng khối lượng cuối cùng = tổng thể tích + thùng chứa.
  const totalWeight = totalVolume + containerWeight;
  // S1000A tính theo thành phẩm.
  const s1000aAmount = targetG * (settings.s1000aPercent / 100);
  // Gusto Lk07 tính theo thành phẩm.
  const gustoLk07Amount = targetG * (settings.lk07Percent / 100);

  // Object lưu toàn bộ kết quả mẻ mì hiện tại.
  const result = {
    time: new Date().toLocaleString("vi-VN"),
    recipeName: "Mì vắt 14kg",
    targetKg: targetKg,
    containerWeight: containerWeight,
    bagWeight: bagWeight,
    totalVolume: totalVolume,
    totalWeight: totalWeight,
    ingredients: {}
  };

  // Tạo phần tiêu đề kết quả.
  let resultHTML = `
    <h2>Công thức cho ${targetKg}kg mì thành phẩm</h2>
    <hr>
  `;

  // Nhóm bột khô và dòng kiểm tra trên cân đã bao gồm bao.
  resultHTML += addResultLine(result, "Bột khô", dryFlour, "g");
  resultHTML += addResultLine(result, "Bột khô kiểm tra trên cân", scaleDryFlour, "g", "highlight-result");
  resultHTML += `<p class="result-note">Đã bao gồm bao ${formatNumber(bagWeight, "g")}g.</p>`;
  resultHTML += "<hr>";
  // Dòng tỷ lệ nước riêng trước nhóm trứng, màu, nước tro.
  resultHTML += `<p>Tỷ lệ nước/bột khô: <b>${waterRatio.toFixed(2)}%</b></p>`;
  // Nhóm trứng, màu, nước tro.
  resultHTML += addResultLine(result, getNoodleIngredientLabel(7), (dryFlour / 1000) * settings.eggPer1400, "trứng");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(9), (dryFlour / 1000) * settings.nuocMauPer1400, "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(8), (dryFlour / 1000) * settings.nuocTroPer1400, "g");
  resultHTML += "<hr>";
  // Nhóm lòng trắng khô, muối, trehalose.
  resultHTML += addResultLine(result, "Lòng trắng khô", targetG * (settings.longTrangKhoPercent / 100), "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(2), dryFlour * (settings.additive2Percent / 100), "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(3), dryFlour * (settings.additive3Percent / 100), "g");
  resultHTML += "<hr>";
  // Nhóm các phụ gia còn lại.
  resultHTML += addResultLine(result, getNoodleIngredientLabel(5), dryFlour * (settings.additive5Percent / 100), "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(6), targetG * (settings.additive6Percent / 100), "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(12), dryFlour * (settings.additive12Percent / 100), "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(10), s1000aAmount, "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(13), gustoLk07Amount, "g");
  resultHTML += "<hr>";
  // Nhóm thùng chứa riêng.
  resultHTML += addResultLine(result, "Thùng chứa", containerWeight, "g");
  resultHTML += "<hr>";
  // Nhóm tổng kết cuối bảng.
  resultHTML += addResultLine(result, "Tổng thể tích (11)", totalVolume, "g");
  resultHTML += addResultLine(result, "Tổng KL = (11) + (12)", totalWeight, "g", "highlight-result");

  // Lưu kết quả hiện tại để có thể bấm "Lưu lịch sử mẻ trộn".
  currentResult = result;
  // Đổ HTML kết quả ra màn hình.
  document.getElementById("result").innerHTML = resultHTML;
}

// Tính công thức hoành thánh/sủi cảo theo khối lượng thành phẩm người dùng nhập.
function calculateDumplingRecipe(targetKg, containerWeight, bagWeight) {
  // Đổi khung kết quả sang nền xanh của hoành thánh/sủi cảo.
  setResultTheme("dumpling");
  // Lấy cấu hình hoành thánh/sủi cảo hiện tại.
  const settings = getDumplingSettings();
  // Đổi kg thành phẩm sang gram.
  const targetG = targetKg * 1000;
  // Tỷ lệ nhân so với mẻ gốc 14kg.
  const ratio = targetKg / settings.baseKg;

  // Bột khô thật cần dùng.
  const dryFlour = settings.dryFlour * ratio;
  // Gluten tính theo công thức: thành phẩm / 1.4 * phần trăm gluten.
  const gluten = (targetG / 1.4) * (settings.glutenPercent / 100);
  // Bột khô cộng gluten để làm nền tính nước tro/nước màu/tổng nước.
  const dryFlourWithGluten = dryFlour + gluten;
  // Bột + gluten + bao để thợ kiểm tra trên cân.
  const scaleDryFlour = dryFlourWithGluten + bagWeight;
  // Tỷ lệ nước/bột khô của hoành thánh/sủi cảo.
  const waterRatio = settings.waterRatioPercent;
  // Tổng thể tích nước/phần lỏng, làm tròn theo chục gram giống bảng.
  const totalVolume = Math.round((dryFlourWithGluten * (waterRatio / 100)) / 10) * 10;
  // Tổng khối lượng cuối cùng = tổng thể tích + thùng chứa.
  const totalWeight = totalVolume + containerWeight;

  // Object lưu toàn bộ kết quả mẻ hoành thánh/sủi cảo hiện tại.
  const result = {
    time: new Date().toLocaleString("vi-VN"),
    recipeName: "Hoành thánh / Sủi cảo",
    targetKg: targetKg,
    containerWeight: containerWeight,
    bagWeight: bagWeight,
    totalVolume: totalVolume,
    totalWeight: totalWeight,
    ingredients: {}
  };

  // Tạo phần tiêu đề kết quả.
  let resultHTML = `
    <h2>Công thức cho ${targetKg}kg hoành thánh / sủi cảo thành phẩm</h2>
    <hr>
  `;

  // Nhóm bột khô, gluten và dòng kiểm tra trên cân đã bao gồm bao.
  resultHTML += addResultLine(result, "Bột khô", dryFlour, "g");
  resultHTML += addResultLine(result, "Gluten", gluten, "g");
  resultHTML += addResultLine(result, "Bột khô + Gluten kiểm tra trên cân", scaleDryFlour, "g", "highlight-result");
  resultHTML += `<p class="result-note">Đã bao gồm bao ${formatNumber(bagWeight, "g")}g.</p>`;
  resultHTML += "<hr>";
  // Dòng tỷ lệ nước riêng trước nhóm trứng, màu, nước tro.
  resultHTML += `<p>Tỷ lệ nước/bột khô: <b>${waterRatio.toFixed(2)}%</b></p>`;
  // Nhóm trứng, màu, nước tro.
  resultHTML += addResultLine(result, getNoodleIngredientLabel(7), (targetG / 1400) * settings.eggPer1400, "trứng");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(9), (dryFlourWithGluten / 1000) * settings.nuocMauPerKgDry, "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(8), (dryFlourWithGluten / 1000) * settings.nuocTroPerKgDry, "g");
  resultHTML += "<hr>";
  // Nhóm lòng trắng khô, muối và trehalose.
  resultHTML += addResultLine(result, "Lòng trắng khô", targetG * (settings.longTrangKhoPercent / 100), "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(2), dryFlour * (settings.additive2Percent / 100), "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(3), dryFlour * (settings.additive3Percent / 100), "g");
  resultHTML += "<hr>";
  // Nhóm phụ gia 4, 5, 6 và phần tổng.
  resultHTML += addResultLine(result, getNoodleIngredientLabel(4), targetG * (settings.additive4Percent / 100), "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(5), (targetG / 1.4) * (settings.additive5Percent / 100), "g");
  resultHTML += addResultLine(result, getNoodleIngredientLabel(6), targetG * (settings.additive6Percent / 100), "g");
  resultHTML += "<hr>";
  // Nhóm thùng chứa riêng.
  resultHTML += addResultLine(result, "Thùng chứa", containerWeight, "g");
  resultHTML += "<hr>";
  // Nhóm tổng kết cuối bảng.
  resultHTML += addResultLine(result, "Tổng thể tích (11)", totalVolume, "g");
  resultHTML += addResultLine(result, "Tổng KL = (11) + (12)", totalWeight, "g", "highlight-result");

  // Lưu kết quả hiện tại để có thể bấm "Lưu lịch sử mẻ trộn".
  currentResult = result;
  // Đổ HTML kết quả ra màn hình.
  document.getElementById("result").innerHTML = resultHTML;
}

// Hàm chính khi bấm nút "Tính công thức".
function calculateRecipe() {
  // Lấy mã công thức đang chọn.
  const selectedRecipe = document.getElementById("recipe").value;
  // Lấy khối lượng thành phẩm cần làm.
  const targetKg = Number(document.getElementById("targetKg").value);
  // Lấy khối lượng thùng chứa, mặc định 800g nếu bỏ trống.
  const containerWeight = Number(document.getElementById("containerWeight").value) || 800;
  // Lấy khối lượng bao, mặc định 140g nếu bỏ trống.
  const bagWeight = Number(document.getElementById("bagWeight").value) || 140;

  // Lấy thông tin công thức tương ứng từ danh sách recipes.
  const recipe = recipes[selectedRecipe];

  // Nếu là công thức mì thì gọi hàm tính mì riêng.
  if (recipe.type === "noodle") {
    calculateNoodleRecipe(targetKg, containerWeight, bagWeight);
    return;
  }

  // Nếu là công thức hoành thánh/sủi cảo thì gọi hàm tính riêng.
  if (recipe.type === "dumpling") {
    calculateDumplingRecipe(targetKg, containerWeight, bagWeight);
    return;
  }

  // Phần dưới là logic dự phòng cho công thức đơn giản có ingredients trực tiếp.
  const ratio = targetKg / recipe.baseKg;

  let resultHTML = `<h2>Kết quả cho ${targetKg}kg</h2>`;

  const calculatedIngredients = {};

  for (let ingredient in recipe.ingredients) {
    const value = ingredient === "Thùng chứa"
      ? containerWeight
      : recipe.ingredients[ingredient] * ratio;

    calculatedIngredients[ingredient] = value;

    resultHTML += `<p>${ingredient}: <b>${value.toFixed(0)} g</b></p>`;
  }

  currentResult = {
    time: new Date().toLocaleString("vi-VN"),
    recipeName: recipe.name,
    targetKg: targetKg,
    containerWeight: containerWeight,
    ingredients: calculatedIngredients
  };

  document.getElementById("result").innerHTML = resultHTML;
}

// Lưu mẻ vừa tính vào lịch sử localStorage.
function saveHistory() {
  // Nếu chưa bấm tính thì không có gì để lưu.
  if (!currentResult) {
    alert("Bạn cần tính công thức trước khi lưu.");
    return;
  }

  // Lấy lịch sử cũ.
  const history = readStorage("mixHistory", []);
  // Lấy user đang đăng nhập để biết ai trộn.
  const user = readStorage("currentUser", null);

  // Nếu chưa đăng nhập thì không cho lưu.
  if (!user) {
    alert("Bạn cần đăng nhập trước khi lưu.");
    return;
  }

  // Gắn tên người trộn vào kết quả hiện tại.
  currentResult.userName = user.name;
  // Gắn email người trộn vào kết quả hiện tại.
  currentResult.userEmail = user.email;

  // Thêm mẻ hiện tại vào cuối lịch sử.
  history.push(currentResult);

  // Lưu lịch sử mới vào trình duyệt.
  localStorage.setItem("mixHistory", JSON.stringify(history));

  // Cập nhật lại danh sách lịch sử trên màn hình.
  showHistory();

  // Báo lưu thành công.
  alert("Đã lưu lịch sử mẻ trộn.");
}

// Hiển thị lịch sử mẻ trộn đã lưu.
function showHistory() {
  // Lấy danh sách lịch sử từ trình duyệt.
  const history = readStorage("mixHistory", []);

  // Chuỗi HTML để hiển thị toàn bộ lịch sử.
  let historyHTML = "";

  // Duyệt từng mẻ đã lưu và tạo một khối lịch sử.
  history.forEach((item, index) => {
    historyHTML += `
      <div class="history-item">
        <b>Mẻ ${index + 1}</b><br>
        Thời gian: ${item.time}<br>
        Người trộn: ${item.userName || "Chưa có"}<br>
        Công thức: ${item.recipeName}<br>
        Khối lượng: ${item.targetKg}kg
      </div>
    `;
  });

  // Đưa HTML lịch sử ra màn hình.
  document.getElementById("history").innerHTML = historyHTML;
}

// Khi mở trang, nếu đã đăng nhập thì hiện app ngay.
showApp();
// Khi mở trang, hiển thị lịch sử đã lưu.
showHistory();
