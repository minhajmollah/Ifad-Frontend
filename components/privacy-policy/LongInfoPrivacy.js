import ListGroup from "react-bootstrap/ListGroup";

export const LongInfoPrivacy = ({info}) => {
    const inputString = info.toString();
    const regex = /([^\r\n]+)\r?\n([\s\S]*?)/g;
    let match;
    const result = [];
    
    while ((match = regex.exec(inputString)) !== null) {
      const title = match[1];
      const text = match[2];
      result.push({ title, text });
    }

  return (
    <div>
      {result.map((item, index) => (
        <div key={index}>
        <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start border-0"
                  >
                    <div className="ms-2 me-auto">
                       {item.title}
                    </div>
        </ListGroup.Item>
        </div>
      ))}
    </div>
  );
};