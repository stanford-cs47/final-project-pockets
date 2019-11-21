export const getBgColor = activity => {
  if (activity.type === 'health') {
    return '#A9DEF9'; // BLUE
  } else if (activity.type === 'fun') {
    return '#FFE6A7'; // YELLOW
  } else if (activity.type === 'edu') {
    return '#F8C0C8'; // RED
  } else if (activity.type === 'productivity') {
    return '#D0F4DE'; // GREEN
  } else {
    return '#DBB1E2'; // PURPLE
  }
};

export const getColor = activity => {
  if (activity.type === 'health') {
    return '#024663'; // BLUE
  } else if (activity.type === 'fun') {
    return '#7A7330'; // YELLOW
  } else if (activity.type === 'edu') {
    return '#C34A76'; // RED
  } else if (activity.type === 'productivity') {
    return '#125518'; // GREEN
  } else {
    return '#772485'; // PURPLE
  }
};
