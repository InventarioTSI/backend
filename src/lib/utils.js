export const mapToHtmlInputType = (dataType) => {
  switch (dataType) {
    case "nvarchar":
      return "text";
    case "int":
      return "number";
    case "date":
      return "date";

    default:
      return "text";
  }
};
