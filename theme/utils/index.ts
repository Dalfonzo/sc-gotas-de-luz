interface responsivePropertyI {
  mobileSize: number
  desktopSize: number
  unit?: 'px' | 'rem' | 'em' | '%'
  numOfBreakPoints?: number
}

/* This function will return an array with the values for each breakpoint */
export const responsiveProperty = ({
  mobileSize,
  desktopSize,
  unit = 'px',
  numOfBreakPoints = 4,
}: responsivePropertyI) => {
  const gap = (desktopSize - mobileSize) / (numOfBreakPoints - 1)
  const breakPointValues = []
  let acc = mobileSize + gap

  for (let i = 0; i < numOfBreakPoints - 2; i++) {
    breakPointValues.push(Math.round(acc) + unit)
    acc = acc + gap
  }

  return [mobileSize + unit, ...breakPointValues, desktopSize + unit]
}
