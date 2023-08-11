import { getStartDate, getEndDate } from "./date-picker.js";
let direction = "OW"; //переключение режимов OW - one way, RT - return
const citiesUrl = "https://humoair.avtra.com/ibe/XY/home/init?language=en";
const airportsUrl = "https://humoair.avtra.com/ibe/XY/destinationAirports/get";
const form = document.querySelector("#card-form");
let formData = new FormData();
//ниже тело запроса, который уходит на сайт
let externalSearchRequest = {
  uuid: "",
  travelPaxInfo: {
    adultCount: 4,
    infantCount: 0,
    paxQuantities: { ADT: "1" },
  },
  availabilitySearchType: "RT",
  searchBehaviour: {},
  anonymousUserDTO: {
    carrierCode: "IF",
    salesChannel: "WEB",
    selectedLanguage: "en",
  },
  pqPref: {
    preferredCurrencyCode: "USD",
  },
  searchedOnDInfos: [
    {
      sequence: 1,
      origin: {
        airportCodes: ["DXB"],
        code: "DXB",
        isAirport: true,
      },
      destination: {
        airportCodes: ["BGW"],
        code: "BGW",
        isAirport: true,
      },
      selectedDepDateStr: "15/08/2023",
      depDayVariance: "PlusMinusThreeDays",
      cabinClassCode: null,
    },
    {
      sequence: 2,
      origin: {
        airportCodes: ["BGW"],
        code: "BGW",
        isAirport: true,
      },
      destination: {
        airportCodes: ["DXB"],
        code: "DXB",
        isAirport: true,
      },
      selectedDepDateStr: "15/08/2023",
      depDayVariance: "PlusMinusThreeDays",
      cabinClassCode: null,
    },
  ],
  depOrigin: {
    code: "ALP",
    airportCodes: ["ALP"],
    isAirport: true,
  },
};
let destinationTo = [];
let destinationFrom = [];

//функция обновления точки вылета

async function updateFrom() {
  await fetch(citiesUrl, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((airports) => {
      let airlineAirports = JSON.parse(airports.result.airlineAirports);
      const airlineAirportsValues = Object.values(airlineAirports);

      airlineAirportsValues.forEach((airport) => {
        let newOption = new Option(
          `${airport.displayShortName} (${airport.airportCode})`,
          airport.airportCode
        );
        $("#destination-from").append(newOption);
      });
    });
}

//функция обновления точки прилета

async function updateTo(airportCode) {
  await fetch(airportsUrl, {
    method: "POST",
    body: JSON.stringify({
      originAirportCodes: airportCode,
      anonymousUserDTO: {
        carrierCode: "XY",
        carrierID: 1,
        selectedLanguage: "en",
        salesChannel: "WEB",
      },
    }),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((airports) => {
      $("#destination-to").prop("disabled", false);
      airports.result.forEach((code) => {
        let newOption = new Option(code, code);
        $("#destination-to").append(newOption);
      });
    });
}

//инициализация

document.addEventListener("DOMContentLoaded", () => {
  $(document).ready(function () {
    $("#destination-from").select2({
      placeholder: "Select destination",
      width: "200", //ширина инпута
      data: destinationFrom,
    });
    $("#destination-to").select2({
      placeholder: "Select destination",
      width: "200", //ширина инпута
      data: destinationTo,
      disabled: true,
    });
  });
  updateFrom();
  updateRequest();
});

//обновление формы

function updateRequest() {
  externalSearchRequest.searchedOnDInfos[0].origin.airportCodes = [
    $("#destination-from").val(),
  ];
  externalSearchRequest.searchedOnDInfos[0].origin.code =
    $("#destination-from").val();
  externalSearchRequest.searchedOnDInfos[1].destination.airportCodes = [
    $("#destination-to").val(),
  ];
  externalSearchRequest.searchedOnDInfos[1].destination.code =
    $("#destination-to").val();

  externalSearchRequest.travelPaxInfo.adultCount =
    Number($("#adults-count").val()) + Number($("#child-count").val());
  externalSearchRequest.travelPaxInfo.infantCount = $("#infants-count").val();
  externalSearchRequest.travelPaxInfo.paxQuantities = {
    ADT: $("#adults-count").val(),
    CHD: $("#child-count").val(),
    INF: $("#infants-count").val(),
  };
  externalSearchRequest.availabilitySearchType = direction;
  externalSearchRequest.searchedOnDInfos[0].selectedDepDateStr = getStartDate();
  externalSearchRequest.searchedOnDInfos[1].selectedDepDateStr = getEndDate();
  formData.set(
    "externalSearchRequest",
    JSON.stringify({ ...externalSearchRequest })
  );
}

//События изменений полей

$("#adults-count").on("change", () => {
  updateRequest();
});

$("#child-count").on("change", () => {
  updateRequest();
});

$("#infants-count").on("change", () => {
  updateRequest();
});

$("#destination-from").on("change", () => {
  updateTo($("#destination-from").val());
  updateRequest();
});

$("#destination-to").on("change", () => {
  $("#card-button").prop("disabled", false);
  $("#card-button").css("background", "#bd5151");
  updateRequest();
});

$("#card-form").submit((evt) => {
  evt.preventDefault();
  updateRequest();
  const externalSearch = new URLSearchParams(formData);
  form.action = `https://booking.flybaghdad.net/ibe/IF/home?language=en&${externalSearch}`;
  form.submit();
});

//Переключение режимов

$(".one-way").on("click", () => {
  direction = "OW";
  updateRequest();
  $("#date-return").css("display", "none");
  $("#return-p").css("display", "none");
  $(".one-way").css("background-color", "#bd5151");
  $(".one-way").css("color", "#fff");
  $(".return").css("background-color", "#fff");
  $(".return").css("color", "#bd5151");
});

$(".return").on("click", () => {
  direction = "RT";
  updateRequest();
  $("#date-return").css("display", "flex");
  $("#return-p").css("display", "flex");
  $(".return").css("background-color", "#bd5151");
  $(".return").css("color", "#fff");
  $(".one-way").css("background-color", "#fff");
  $(".one-way").css("color", "#bd5151");
});
