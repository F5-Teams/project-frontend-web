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
      /iu/g,
      '<span class="text-primary font-poppins-regular italic">iu</span>'
    );
};
