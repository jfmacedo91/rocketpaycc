import IMask from "imask"

import "./css/index.css"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    "visa": ["#2563EB", "#0284C7"],
    "mastercard": ["#EAB308", "#EF4444"],
    "elo": ["#18181B", "#2563EB"],
    "default": ["#18181B", "#52525B"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `/cc-${ type }.svg`)
}

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4[0-9]{0,15}$/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{0,2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/,
      cardtype: "elo"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^((5(([1-2]|[4-5])[0-9]{0,8}|0((1|6)([0-9]{0,7}))|3(0(4((0|[2-9])[0-9]{0,5})|([0-3]|[5-9])[0-9]{0,6})|[1-9][0-9]{0,7})))|((508116)\\d{4,10})|((502121)\\d{4,10})|((589916)\\d{4,10})|(2[0-9]{0,15})|(67[0-9]{0,14})|(506387)\\d{4,10})/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addCardButton = document.querySelector("#add-card")
addCardButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerHTML = cardHolder.value.length === 0 ? "NOME DO TITULAR" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = securityCodeMasked.value.length === 0
    ? "000"
    : securityCodeMasked.value
})

expirationDateMasked.on("accept", () => {
  const ccExpirationDate = document.querySelector(".cc-expiration .value")
  ccExpirationDate.innerText = expirationDateMasked.value.length === 0
    ? "00/00"
    : expirationDateMasked.value
})

cardNumberMasked.on("accept", () => {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = cardNumberMasked.value.length === 0
    ? "0000 0000 0000 0000"
    : cardNumberMasked.value

  setCardType(cardNumberMasked.masked.currentMask.cardtype)
})