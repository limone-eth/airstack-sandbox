const sortByScore = (recommendations) => recommendations.sort((a, b) => (b._score || 0) - (a._score || 0))

export default sortByScore;