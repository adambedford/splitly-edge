export default function weightedRandom(options) {
  var i;
  var weights = [options[0].weight];

  for (i = 1; i < options.length; i++) {
    weights[i] = options[i].weight + weights[i - 1];
  }

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

  return options[i];
}
