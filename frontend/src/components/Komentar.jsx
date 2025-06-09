import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, Alert, Button, Form } from "react-bootstrap";
import { FaUserCircle, FaPaperPlane, FaReply } from "react-icons/fa";
import { MdEdit, MdDeleteForever } from "react-icons/md";

const Komentar = ({ benih_id }) => {
  const [fetchedComments, setFetchedComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [mainCommentContent, setMainCommentContent] = useState("");
  const [replyContents, setReplyContents] = useState({});
  const [showFormById, setShowFormById] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/get-comments/${benih_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFetchedComments(data.comments);
        setUserId(data.user_id);
        console.log(data);
      } else {
        setMessage(data.error || "Gagal memuat data komentar");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat memuat data:" + err);
    }
  }, [benih_id]);

  useEffect(() => {
    fetchComments();
  }, [benih_id, fetchComments]);

  // Memisahkan komentar utama dan balasan
  const mainComments = fetchedComments.filter((comment) => !comment.parent_id);
  const replies = fetchedComments.filter((comment) => comment.parent_id);

  const resetCommentForm = () => {
    setMainCommentContent("");
    setShowButton(false);
    setReplyContents({});
    setReplyingTo(null);
    setShowFormById(null);
  };

  const formatWIB = (timestamp) => {
    return new Date(
      new Date(timestamp).getTime() - 7 * 60 * 60 * 1000
    ).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // const formEdit = (comment) => {
  //   setMainCommentContent(comment.content);
  //   setShowButton(true);
  //   setReplyingTo(comment.id);
  //   setShowFormById(null);
  // };

  const handleAddComment = async (e) => {
    e.preventDefault();

    try {
      const content = replyingTo
        ? replyContents[showFormById] || ""
        : mainCommentContent;

      const response = await fetch("http://localhost:5000/add-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          benih_id: benih_id,
          content: content,
          parent_id: replyingTo,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        resetCommentForm();
        fetchComments();
      } else {
        setMessage(data.error || "Gagal mengirim komentar");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat mengirim komentar: " + err);
    }
  };

  return (
    <Container className="bg-white shadow my-5 p-4 col-12 col-md-10 col-lg-8 mx-auto">
      <h2 className="display-6 fw-semibold fs-3">Komentar</h2>
      <p>{typeof userId}</p>
      <Form method="POST" onSubmit={handleAddComment} className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          name="content"
          value={mainCommentContent}
          onChange={(e) => setMainCommentContent(e.target.value)}
          placeholder={"Bagaimana pendapat Anda tentang benih ini?"}
          onInput={() => setShowButton(true)}
        />
        {showButton && (
          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={resetCommentForm}
            >
              Batal
            </Button>
            <Button
              variant="outline-success"
              type="submit"
              className="d-flex align-items-center"
              disabled={!mainCommentContent.trim()}
            >
              <FaPaperPlane className="me-2" />
              Kirim komentar
            </Button>
          </div>
        )}
      </Form>

      {message && (
        <Alert
          variant={message.includes("Gagal") ? "danger" : "success"}
          onClose={() => setMessage("")}
          dismissible
        >
          {message}
        </Alert>
      )}

      {mainComments.length === 0 ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Text className="text-center">
              Belum ada komentar untuk benih ini.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        mainComments.map((comment) => (
          <div key={`main-${comment.id}`}>
            <Card className="mt-3" style={{ border: "2px solid #628B35" }}>
              <Card.Body>
                <Card.Title>
                  <FaUserCircle color="#628B35" size={40} className="me-2" />
                  {comment.username}
                  <p className="float-end text-muted fs-6 fw-light">
                    {formatWIB(comment.updated_at)}
                  </p>
                </Card.Title>
                <Card.Text>{comment.content}</Card.Text>

                {showFormById !== comment.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => {
                        setShowFormById(comment.id);
                        setReplyingTo(comment.id);
                        setReplyContents((prev) => ({
                          ...prev,
                          [comment.id]: "",
                        }));
                      }}
                    >
                      <FaReply className="me-2" />
                      Balas Komentar
                    </Button>
                    {comment.account_id === userId && (
                      <div className="float-end d-flex gap-3">
                        <Button
                          variant="transparent"
                          style={{
                            color: "#628B35",
                            border: "none",
                            padding: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          // onClick={() => handleEditComment(comment.id)}
                        >
                          <MdEdit color="#628B35" className="me-1" />
                          Edit
                        </Button>
                        <Button
                          variant="transparent"
                          style={{
                            color: "#628B35",
                            border: "none",
                            padding: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          // onClick={() => handleDeleteComment(comment.id)}
                        >
                          <MdDeleteForever color="#628B35" className="me-1" />
                          Hapus
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Form
                    method="POST"
                    onSubmit={handleAddComment}
                    className="mt-2"
                  >
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="content"
                      value={replyContents[comment.id] || ""}
                      onChange={(e) =>
                        setReplyContents((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      placeholder={`Balas komentar ${comment.username}`}
                    />
                    <div className="d-flex justify-content-end mt-2">
                      <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={resetCommentForm}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="outline-success"
                        type="submit"
                        className="d-flex align-items-center"
                        disabled={!replyContents[comment.id]?.trim()}
                      >
                        <FaPaperPlane className="me-2" />
                        Kirim komentar
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>

            {replies
              .filter((reply) => reply.parent_id === comment.id)
              .map((reply) => (
                <Card
                  key={`reply-${reply.id}`}
                  className="mt-2 ms-5"
                  style={{
                    border: "2px solid #628B35",
                    borderLeft: "4px solid #628B35",
                  }}
                >
                  <Card.Body>
                    <Card.Subtitle className="mb-2">
                      <FaUserCircle
                        color="#628B35"
                        size={30}
                        className="me-2"
                      />
                      <p className="d-inline">{reply.username} </p>
                      <p className="text-muted d-inline fw-light">
                        (membalas {comment.username})
                      </p>
                      <p className="float-end text-muted fs-6 fw-light">
                        {formatWIB(reply.updated_at)}
                      </p>
                    </Card.Subtitle>
                    <Card.Text>{reply.content}</Card.Text>
                    {showFormById !== reply.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => {
                            setShowFormById(reply.id);
                            setReplyingTo(comment.id);
                            setReplyContents((prev) => ({
                              ...prev,
                              [reply.id]: "",
                            }));
                          }}
                        >
                          <FaReply className="me-2" />
                          Balas Komentar
                        </Button>
                        {reply.account_id === userId && (
                          <div className="float-end d-flex gap-3">
                            <Button
                              variant="transparent"
                              style={{
                                color: "#628B35",
                                border: "none",
                                padding: 0,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              // onClick={() => handleEditComment(reply.id)}
                            >
                              <MdEdit color="#628B35" className="me-1" />
                              Edit
                            </Button>
                            <Button
                              variant="transparent"
                              style={{
                                color: "#628B35",
                                border: "none",
                                padding: 0,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              // onClick={() => handleDeleteComment(reply.id)}
                            >
                              <MdDeleteForever
                                color="#628B35"
                                className="me-1"
                              />
                              Hapus
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <Form
                        method="POST"
                        onSubmit={handleAddComment}
                        className="mt-2"
                      >
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="content"
                          value={replyContents[reply.id] || ""}
                          onChange={(e) =>
                            setReplyContents((prev) => ({
                              ...prev,
                              [reply.id]: e.target.value,
                            }))
                          }
                          placeholder={`Balas komentar ${reply.username}`}
                        />
                        <div className="d-flex justify-content-end mt-2">
                          <Button
                            variant="outline-secondary"
                            className="me-2"
                            onClick={resetCommentForm}
                          >
                            Batal
                          </Button>
                          <Button
                            variant="outline-success"
                            type="submit"
                            className="d-flex align-items-center"
                            disabled={!replyContents[reply.id]?.trim()}
                          >
                            <FaPaperPlane className="me-2" />
                            Kirim komentar
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Card.Body>
                </Card>
              ))}
          </div>
        ))
      )}
    </Container>
  );
};

export default Komentar;
