void _uncheckSeat(int index) {
    // chiarList.value[index] = chiarList.value[index]!.copyWith(isAvilable: true);
    // avalibleChairList.value = [];
    // selectedChiarList.value.remove(index);
    // avalibleChairList.value = List.of(avalibleChairList.value)..clear();
    // if (index ~/ row == (column - 1)) return;

    int seat = 0;
    if (index % row < rightSeat) {
      for (int i = ((index ~/ row) * row);
          i < ((index ~/ row) * row + rightSeat);
          i++) {
        if (chiarList.value[i] != null && chiarList.value[i]!.isAvilable!) {
          avalibleChairList.value = List.of(avalibleChairList.value)..add(i);
        }

        if (!selectedChiarList.value.contains(i) &&
            !chiarList.value[i]!.isAvilable!) {
          seat++;
        }
      }

      if (avalibleChairList.value.length + seat == rightSeat) {
        avalibleChairList.value = List.of(avalibleChairList.value)..clear();
      }
    } else {
      for (int i = ((((index ~/ row) + 1) * row)) - leftSeat - 1;
          i < ((((index ~/ row) + 1) * row));
          i++) {
        if (chiarList.value[i] != null && chiarList.value[i]!.isAvilable!) {
          avalibleChairList.value = List.of(avalibleChairList.value)..add(i);
        }
        if (chiarList.value[i] != null &&
            !selectedChiarList.value.contains(i) &&
            !chiarList.value[i]!.isAvilable!) {
          seat++;
        }
      }
      if (avalibleChairList.value.length + seat == leftSeat) {
        avalibleChairList.value = List.of(avalibleChairList.value)..clear();
      }
    }
  }