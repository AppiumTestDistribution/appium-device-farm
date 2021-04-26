let actual = [{ busy: false, state: 'device', udid: 'emulator-5554' }];
let emitterValue = [
  { udid: 'emulator-5554', state: 'device' },
  { udid: 'emulator-5552', state: 'device' },
];

function comparer(otherArray) {
  return function (current) {
    return (
      otherArray.filter(function (other) {
        return other.udid === current.udid;
      }).length === 0
    );
  };
}

var onlyInB = emitterValue.filter(comparer(actual));

console.log(onlyInB);
