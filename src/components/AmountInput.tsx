interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function AmountInput({ value, onChange }: Props) {
  return (
    <div className="input-group">
      <label className="label" htmlFor="amount-input">
        Amount
      </label>
      <input
        id="amount-input"
        className="input"
        type="number"
        min="0"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder="0"
      />
    </div>
  );
}
