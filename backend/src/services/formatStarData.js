 function formatStarData(data) {
    return data.map((star) => {
      let [SourceID,RightAscension, Declination, Parallax, Distance, Magnitude, Bp_Rp] = star
      return { SourceID,RightAscension, Declination, Parallax, Distance, Magnitude, Bp_Rp };
    });
  }

  module.exports = formatStarData