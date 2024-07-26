function createUrl(req, res) {
  const data = {
    message: "Url created successfully",
  };
  return res.status(200).json(data);
}

export default createUrl;
