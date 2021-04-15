let data = [];
const ticketCardArea = document.querySelector('.ticketCard-area');

function renderView(data) {
  let liList = '';
  data.forEach((item) => {
    liList += `<li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img src="${item.imgUrl}" alt="">
          </a>
          <div class="ticketCard-region">${item.area}</div>
          <div class="ticketCard-rank">${item.rate}</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${item.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">$${item.price}</span>
            </p>
          </div>
        </div>
      </li>`;
  });
  ticketCardArea.innerHTML = liList;
}

axios
  .get(
    'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json'
  )
  .then(function (res) {
    data = res.data.data;
    renderView(data);
    chartInit();
  });

const addTicketBtn = document.querySelector('.addTicket-btn');
const ticketName = document.querySelector('#ticketName');
const ticketImgUrl = document.querySelector('#ticketImgUrl');
const ticketRegion = document.querySelector('#ticketRegion');
const ticketPrice = document.querySelector('#ticketPrice');
const ticketNum = document.querySelector('#ticketNum');
const ticketRate = document.querySelector('#ticketRate');
const ticketDescription = document.querySelector('#ticketDescription');

function isEmpty() {
  if (ticketName.value === '') return true;
  if (ticketImgUrl.value === '') return true;
  if (ticketRegion.value === '') return true;
  if (ticketDescription.value === '') return true;
  if (ticketNum.value === '') return true;
  if (ticketPrice.value === '') return true;
  if (ticketRate.value === '') return true;
  return false;
}
function dataProcess() {
  if (ticketRate.value < 1 || ticketRate.value > 10) {
    console.log('套票星級區間為1~10之間');
    return false;
  }
}
function inputInit() {
  ticketName.value = '';
  ticketImgUrl.value = '';
  ticketRegion.value = '';
  ticketDescription.value = '';
  ticketNum.value = '';
  ticketPrice.value = '';
  ticketRate.value = '';
}

addTicketBtn.addEventListener('click', function () {
  if (isEmpty() == true) {
    console.log('必須填完資料!!');
    return;
  }
  if (dataProcess() == false) return;
  data.push({
    id: data.length,
    name: ticketName.value,
    imgUrl: ticketImgUrl.value,
    area: ticketRegion.value,
    description: ticketDescription.value,
    group: ticketNum.value,
    price: ticketPrice.value,
    rate: ticketRate.value,
  });
  inputInit();
  chartInit();
  renderView(data);
});

const regionSearch = document.querySelector('.regionSearch');
const searchResultText = document.querySelector('#searchResult-text');

regionSearch.addEventListener('change', function () {
  const select = this.value;
  let filterData = data.filter((item) => {
    // 若 select 為空 (意指"全部地區") ，則不 filter
    return select ? item.area === select : true;
  });

  renderView(filterData);
  searchResultText.innerHTML = `本次搜尋共 ${filterData.length} 筆資料`;
});

function chartInit() {
  let totalObj = {};
  data.forEach(function (item, index) {
    if (totalObj[item.area] == undefined) {
      totalObj[item.area] = 1;
    } else {
      totalObj[item.area] += 1;
    }
    // console.log(totalObj)
  });

  // newData = [["高雄", 2], ["台北",1], ["台中", 1]]
  let newData = [];
  let area = Object.keys(totalObj);

  area.forEach(function (item, index) {
    let ary = [];
    ary.push(item);
    ary.push(totalObj[item]);
    // console.log(ary)
    newData.push(ary);
  });

  // 將 newData 丟入 c3 產生器
  const chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: newData,
      type: 'donut',
    },
    donut: {
      title: '套票地區比重',
      width: 15,
      label: {
        show: false, // 標籤不顯示
      },
    },
    size: {
      // 大小
      height: 160,
      width: 160,
    },
    color: {
      pattern: ['#26C0C7', '#5151D3', '#E68618'],
    },
  });
}
