export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
}, {
  id: '2',
  deliveryDays: 3,
  priceCents: 499
}, {
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOption[0];
}

export function calculateDeliveryDate(deliveryOption) {
      // const today = dayjs();
    // const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    // const dateString = deliveryDate.format('dddd, MMMM D');

    const today = new Date();
    let deliveryDate = new Date(today);
    let remainingDays = deliveryOption.deliveryDays;

    while (remainingDays > 0) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);

      const dayOfWeek = deliveryDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        remainingDays--;
      }
    }

      let dateString = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
});

return dateString;
}

export function calculateDeliveryDateObj(deliveryOption) {
const today = new Date();
let deliveryDate = new Date(today.getTime());
let remainingDays = deliveryOption.deliveryDays;

while (remainingDays > 0) {
  deliveryDate.setDate(deliveryDate.getDate() + 1);

  const dayOfWeek = deliveryDate.getDay();
  if (dayOfWeek !== 0 && dayOfWeek !== 6) {
    remainingDays--;
  }
}
return deliveryDate;
}