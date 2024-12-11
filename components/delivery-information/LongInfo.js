import {AiFillCaretRight} from "react-icons/ai";

export const LongInfo = ({info}) => {
    const inputString = info.toString();
    const regex = /([^\r\n]+)\r?\n([\s\S]*?)(?=\r?\n\r?\n|$)/g;
    let match;
    const result = [];

    while ((match = regex.exec(inputString)) !== null) {
        const title = match[1];
        const text = match[2];
        result.push({title, text});
    }

    return (
        <div>
            {result.map((item, index) => (
                <div key={index}>
                    <div className="d-flex justify-content-start">
                        <AiFillCaretRight/>
                        <h5 className="text-capitalize pb-2 ps-2 font-inter font-16 fw-bold">
                            {item.title}
                        </h5>
                    </div>
                    <p
                        className="text-capitalize font-inter font-16 ps-4 pb-4"
                    >
                        {item.text}
                    </p>
                </div>
            ))}
        </div>
    );
};