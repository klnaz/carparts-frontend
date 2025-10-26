interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => (
  <h2 className="text-2xl font-semibold text-gray-900 mb-4">{text}</h2>
);

export default Title;
