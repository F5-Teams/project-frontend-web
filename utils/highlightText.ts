export const highlightText = (text: string) => {
  return text
    .replace(
      /Boss/g,
      '<span class="text-primary font-poppins-regular">Boss</span>'
    )
    .replace(
      /Sen/g,
      '<span class="text-secondary font-poppins-regular">Sen</span>'
    )
    .replace(
      /chê/g,
      '<span class="text-primary font-poppins-regular italic">chê</span>'
    )
    .replace(
      /mê/g,
      '<span class="text-primary font-poppins-regular italic">mê</span>'
    );
};
